import { messageRepository } from "#modules/message/repository/message.repository.js";
import type {
  CreateMessageInput,
  UpdateMessageInput,
} from "#modules/message/schema/message.schema.js";
import { ForbiddenError, NotFoundError } from "#shared/errors/app-error.js";
import { Permission } from "#shared/permissions/permissions.js";
import { parseMentions } from "#utils/mention.parser";
import { hasPermission } from "#utils/permission.js";
import {
  broadcastMessageCreated,
  broadcastMessageDeleted,
  broadcastMessageMention,
  broadcastMessageUpdated,
} from "#websocket/broadcast";

export class MessageService {
  private async getActorPermissions(serverId: string, userId: string): Promise<bigint> {
    const server = await messageRepository.findServerOwner(serverId);

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    if (server.ownerId === userId) {
      return Permission.ADMINISTRATOR;
    }

    const member = await messageRepository.findMemberPermissions(serverId, userId);

    if (!member) {
      throw new ForbiddenError("Kamu bukan member dari server ini");
    }

    return member.roles.reduce<bigint>(
      (total, memberRole) => total | memberRole.role.permissionsBitmask,
      0n,
    );
  }

  private async ensureSendMessagesPermission(serverId: string, userId: string) {
    const permissions = await this.getActorPermissions(serverId, userId);

    if (!hasPermission(permissions, Permission.SEND_MESSAGES)) {
      throw new ForbiddenError("Kamu tidak memiliki permission untuk mengirim pesan");
    }

    return permissions;
  }

  private async getMessage(messageId: string) {
    const message = await messageRepository.findServerContext(messageId);

    if (!message) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    return message;
  }

  async create(channelId: string, userId: string, input: CreateMessageInput) {
    const channel = await this.getChannel(channelId);

    await this.ensureSendMessagesPermission(channel.serverId, userId);

    if (input.replyToId) {
      await this.ensureValidReplyTarget(input.replyToId, channelId);
    }

    if (input.threadRootId) {
      await this.ensureValidThreadRoot(input.threadRootId, channelId);
    }

    const message = await messageRepository.create({
      channelId,
      authorId: userId,
      content: input.content,
      replyToId: input.replyToId ?? null,
      threadRootId: input.threadRootId ?? null,
    });

    broadcastMessageCreated(message);

    const mentionedUserIds = parseMentions(input.content);

    for (const mentionedUserId of mentionedUserIds) {
      const mentionedMember = await messageRepository.findServerMember(
        channel.serverId,
        mentionedUserId,
      );

      if (!mentionedMember) {
        continue;
      }

      broadcastMessageMention({
        messageId: message.id,
        channelId: message.channelId,
        serverId: channel.serverId,
        authorId: message.authorId,
        mentionedUserId,
      });
    }

    return message;
  }

  async update(messageId: string, userId: string, input: UpdateMessageInput) {
    const message = await this.getMessage(messageId);

    if (message.isDeleted) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    const permissions = await this.getActorPermissions(message.channel.serverId, userId);

    const isAuthor = message.authorId === userId;
    const canManageMessages = hasPermission(permissions, Permission.MANAGE_MESSAGES);

    if (!isAuthor && !canManageMessages) {
      throw new ForbiddenError("Kamu tidak dapat mengedit pesan ini");
    }

    const updatedMessage = await messageRepository.update(messageId, {
      content: input.content,
    });

    broadcastMessageUpdated(updatedMessage);

    return updatedMessage;
  }

  async delete(messageId: string, userId: string) {
    const message = await this.getMessage(messageId);

    if (message.isDeleted) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    const permissions = await this.getActorPermissions(message.channel.serverId, userId);

    const isAuthor = message.authorId === userId;
    const canManageMessages = hasPermission(permissions, Permission.MANAGE_MESSAGES);

    if (!isAuthor && !canManageMessages) {
      throw new ForbiddenError("Kamu tidak dapat menghapus pesan ini");
    }

    const deletedMessage = await messageRepository.softDelete(messageId);

    broadcastMessageDeleted(deletedMessage);

    return deletedMessage;
  }

  private async getChannel(channelId: string) {
    const channel = await messageRepository.findChannelById(channelId);

    if (!channel) {
      throw new NotFoundError("Channel tidak ditemukan");
    }

    return channel;
  }

  private async ensureValidReplyTarget(messageId: string, channelId: string) {
    const message = await messageRepository.findReplyTarget(messageId);

    if (!message) {
      throw new NotFoundError("Pesan reply tidak ditemukan");
    }

    if (message.channelId !== channelId) {
      throw new ForbiddenError("Pesan reply harus berada di channel yang sama");
    }

    if (message.isDeleted) {
      throw new NotFoundError("Pesan reply tidak ditemukan");
    }
  }

  private async ensureValidThreadRoot(messageId: string, channelId: string) {
    const message = await messageRepository.findReplyTarget(messageId);

    if (!message) {
      throw new NotFoundError("Thread root message tidak ditemukan");
    }

    if (message.channelId !== channelId) {
      throw new ForbiddenError("Thread root harus berada di channel yang sama");
    }

    if (message.isDeleted) {
      throw new NotFoundError("Thread root message tidak ditemukan");
    }
  }
  async pin(messageId: string, userId: string) {
    const message = await this.getMessage(messageId);

    if (message.isDeleted) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    const permissions = await this.getActorPermissions(message.channel.serverId, userId);

    if (!hasPermission(permissions, Permission.MANAGE_MESSAGES)) {
      throw new ForbiddenError("Kamu tidak memiliki permission untuk menyematkan pesan");
    }

    if (message.isPinned) {
      return message;
    }

    const pinnedMessage = await messageRepository.update(messageId, {
      isPinned: true,
    });

    broadcastMessageUpdated(pinnedMessage);

    return pinnedMessage;
  }

  async unpin(messageId: string, userId: string) {
    const message = await this.getMessage(messageId);

    if (message.isDeleted) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    const permissions = await this.getActorPermissions(message.channel.serverId, userId);

    if (!hasPermission(permissions, Permission.MANAGE_MESSAGES)) {
      throw new ForbiddenError("Kamu tidak memiliki permission untuk melepas sematan pesan");
    }

    if (!message.isPinned) {
      return message;
    }

    const unpinnedMessage = await messageRepository.update(messageId, {
      isPinned: false,
    });

    broadcastMessageUpdated(unpinnedMessage);

    return unpinnedMessage;
  }
}

export const messageService = new MessageService();
