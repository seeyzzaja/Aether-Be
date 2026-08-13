import { messageRepository } from "#modules/message/repository/message.repository";
import type {
  CreateMessageInput,
  UpdateMessageInput,
} from "#modules/message/schema/message.schema";
import {
  createUserNotification,
  enqueueEmailNotification,
} from "#modules/notification/service/notification.service";
import { getPresenceConnections } from "#modules/presence/repository/presence.repository";
import { ForbiddenError, NotFoundError } from "#shared/errors/app-error";
import { Permission } from "#shared/permissions/permissions";
import { publishWebSocketEvent } from "#shared/redis/redis.publisher";
import { parseMentions } from "#utils/mention.parser";
import { hasPermission } from "#utils/permission";
import { WebSocketEvent } from "#websocket/constants/events";

export class MessageService {
  private runInBackground(task: Promise<unknown>, label: string) {
    void task.catch((error: unknown) => {
      console.error(`[MessageService] ${label} failed:`, error);
    });
  }

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

    return member.roles.reduce(
      (total: bigint, memberRole: { role: { permissionsBitmask: bigint } }) =>
        total | memberRole.role.permissionsBitmask,
      0n,
    );
  }

  private async ensureSendMessagesPermission(serverId: string, channelId: string, userId: string) {
    const serverPermissions = await this.getActorPermissions(serverId, userId);

    if (hasPermission(serverPermissions, Permission.ADMINISTRATOR)) {
      return serverPermissions;
    }

    const channelPermissions = await messageRepository.findChannelPermissions(
      channelId,
      serverId,
      userId,
    );

    if (channelPermissions === null) {
      throw new ForbiddenError("Kamu bukan member dari server ini");
    }

    if (!hasPermission(channelPermissions, Permission.SEND_MESSAGES)) {
      throw new ForbiddenError(
        "Kamu tidak memiliki permission untuk mengirim pesan di channel ini",
      );
    }

    return channelPermissions;
  }

  private async getMessage(messageId: string) {
    const message = await messageRepository.findServerContext(messageId);

    if (!message) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    return message;
  }

  async create(channelId: string, userId: string, input: CreateMessageInput) {
    console.log("[MessageService.create] start", {
      channelId,
      userId,
      hasReplyToId: Boolean(input.replyToId),
      hasThreadRootId: Boolean(input.threadRootId),
    });

    const channel = await this.getChannel(channelId);

    await this.ensureSendMessagesPermission(channel.serverId, channelId, userId);

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
      ...(input.attachments && {
        attachments: input.attachments.map((attachment) => ({
          fileUrl: attachment.fileUrl,
          thumbnailUrl: attachment.thumbnailUrl ?? null,
          fileType: attachment.fileType,
          fileSize: attachment.fileSize,
          fileName: attachment.fileName,
        })),
      }),
    });
    console.log("[MessageService.create] message persisted", {
      messageId: message.id,
      channelId: message.channelId,
    });

    this.runInBackground(
      publishWebSocketEvent({
        event: WebSocketEvent.MESSAGE_CREATED,
        data: message,
      }),
      "publish message.created",
    );

    const mentionedUserIds = parseMentions(input.content);
    console.log("[MessageService.create] mentions parsed", {
      count: mentionedUserIds.length,
      mentionedUserIds,
    });
    for (const mentionedUserId of mentionedUserIds) {
      if (mentionedUserId === userId) {
        continue;
      }

      const mentionedMember = await messageRepository.findServerMember(
        channel.serverId,
        mentionedUserId,
      );

      if (!mentionedMember) {
        continue;
      }

      console.log("[MessageService.create] mention matched server member", {
        mentionedUserId,
        serverId: channel.serverId,
      });
      console.log("[MessageService.create] starting mention background task", {
        mentionedUserId,
      });

      this.runInBackground(
        (async () => {
          console.log("[MessageService.create] mention background START", {
            mentionedUserId,
          });

          const notification = await createUserNotification({
            userId: mentionedUserId,
            type: "mention",
            payload: {
              messageId: message.id,
              channelId: message.channelId,
              serverId: channel.serverId,
              authorId: message.authorId,
            },
          });
          console.log("[MessageService.create] notification created", {
            mentionedUserId,
            notificationId: notification.id,
          });

          await publishWebSocketEvent({
            event: WebSocketEvent.NOTIFICATION_CREATED,
            data: {
              userId: mentionedUserId,
              notification,
            },
          });
          const connections = await getPresenceConnections(mentionedUserId);
          console.log("[MessageService.create] presence checked", {
            mentionedUserId,
            connections,
          });

          if (connections === 0) {
            console.log("[MessageService.create] enqueue email START", {
              mentionedUserId,
            });
            await enqueueEmailNotification({
              userId: mentionedUserId,
              subject: "You were mentioned in Aether",
              text: "You were mentioned in a message on Aether.",
              html: `
      <h2>You were mentioned in Aether</h2>
      <p>You have a new mention in Aether.</p>
      <p>Open Aether to see the message.</p>
    `,
            });
            console.log("[MessageService.create] enqueue email DONE", {
              mentionedUserId,
            });
          }
          await publishWebSocketEvent({
            event: WebSocketEvent.MESSAGE_MENTION,
            data: {
              messageId: message.id,
              channelId: message.channelId,
              serverId: channel.serverId,
              authorId: message.authorId,
              mentionedUserId,
            },
          });
          console.log("[MessageService.create] mention background DONE", {
            mentionedUserId,
          });
        })(),
        `process mention ${mentionedUserId}`,
      );
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

    await publishWebSocketEvent({
      event: WebSocketEvent.MESSAGE_UPDATED,
      data: updatedMessage,
    });

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

    await publishWebSocketEvent({
      event: WebSocketEvent.MESSAGE_DELETED,
      data: deletedMessage,
    });

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

    await publishWebSocketEvent({
      event: WebSocketEvent.MESSAGE_UPDATED,
      data: pinnedMessage,
    });

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

    await publishWebSocketEvent({
      event: WebSocketEvent.MESSAGE_UPDATED,
      data: unpinnedMessage,
    });

    return unpinnedMessage;
  }
  async search(
    serverId: string,
    userId: string,
    input: {
      q: string;
      channelId?: string;
      limit: number;
      offset: number;
    },
  ) {
    const permissions = await this.getActorPermissions(serverId, userId);

    if (!hasPermission(permissions, Permission.VIEW_CHANNEL)) {
      throw new ForbiddenError("Kamu tidak memiliki permission VIEW_CHANNEL");
    }

    if (input.channelId) {
      const channel = await messageRepository.findChannelById(input.channelId);

      if (!channel) {
        throw new NotFoundError("Channel tidak ditemukan");
      }

      if (channel.serverId !== serverId) {
        throw new ForbiddenError("Channel bukan bagian dari server ini");
      }
    }

    const searchOptions = {
      ...(input.channelId !== undefined && {
        channelId: input.channelId,
      }),
      limit: input.limit,
      offset: input.offset,
    };

    const [messages, total] = await Promise.all([
      messageRepository.search(serverId, input.q, searchOptions),
      messageRepository.countSearch(serverId, input.q, input.channelId),
    ]);

    return {
      messages,
      total,
      offset: input.offset,
      limit: input.limit,
    };
  }
  async getThread(threadRootId: string, userId: string) {
    const rootMessage = await messageRepository.findByIdWithChannel(threadRootId);

    if (!rootMessage) {
      throw new NotFoundError("Thread root message tidak ditemukan");
    }

    if (rootMessage.isDeleted) {
      throw new NotFoundError("Thread root message tidak ditemukan");
    }

    await this.ensureSendMessagesPermission(
      rootMessage.channel.serverId,
      rootMessage.channelId,
      userId,
    );

    const messages = await messageRepository.findThreadMessages(threadRootId);

    return {
      rootMessage,
      messages,
    };
  }
}
export const messageService = new MessageService();
