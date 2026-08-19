import { createHash, randomUUID } from "node:crypto";
import { auditService } from "#modules/audit/service/audit.service";
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
import { ForbiddenError, NotFoundError, TooManyRequestsError } from "#shared/errors/app-error";
import { logger } from "#shared/logger/logger";
import { Permission } from "#shared/permissions/permissions";
import { connectRedis, redisClient } from "#shared/redis/redis.client";
import { publishWebSocketEvent } from "#shared/redis/redis.publisher";
import { parseMentions, parseRoleMentions } from "#utils/mention.parser";
import { hasPermission } from "#utils/permission";
import { WebSocketEvent } from "#websocket/constants/events";

const DUPLICATE_MESSAGE_WINDOW_SECONDS = 30;
const DUPLICATE_MESSAGE_THRESHOLD = 5;
const DUPLICATE_MESSAGE_THROTTLE_SECONDS = 60;
const ANTI_SPAM_THROTTLE_REVIEW_WINDOW_SECONDS = 30 * 24 * 60 * 60;
const ANTI_SPAM_REVIEW_THRESHOLD = 3;
const SUSPICIOUS_LINK_ACCOUNT_AGE_MS = 24 * 60 * 60 * 1000;

type MessageWarningFlags = {
  suspiciousLink: boolean;
  antiSpam: {
    duplicate: boolean;
    throttled: boolean;
    reviewFlagged: boolean;
  };
};

function extractUrls(content: string): string[] {
  const matches = content.match(/https?:\/\/[^\s<>()]+/gi) ?? [];

  return [...new Set(matches.map((value) => value.replace(/[.,!?;:]+$/, "")))];
}

function normalizeContentForSpam(content: string) {
  return content
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export class MessageService {
  private runInBackground(task: Promise<unknown>, label: string) {
    void task.catch((error: unknown) => {
      logger.error({ err: error, label }, "Background task failed");
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

  private async ensureSendMessagesPermission(
    serverId: string | null,
    channelId: string,
    userId: string,
  ) {
    const channel = await messageRepository.findChannelById(channelId);

    if (!channel) {
      throw new NotFoundError("Channel tidak ditemukan");
    }

    if (channel.type === "DM" || channel.type === "GROUP_DM") {
      const participant = await messageRepository.findDmParticipant(channelId, userId);

      if (!participant) {
        throw new ForbiddenError("Kamu bukan participant pada conversation ini");
      }

      return 0n;
    }

    if (!serverId) {
      throw new ForbiddenError("Channel tidak terhubung ke server");
    }

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
  private async ensureViewChannelPermission(
    serverId: string | null,
    channelId: string,
    userId: string,
  ) {
    const channel = await messageRepository.findChannelById(channelId);

    if (!channel) {
      throw new NotFoundError("Channel tidak ditemukan");
    }

    if (channel.type === "DM" || channel.type === "GROUP_DM") {
      const participant = await messageRepository.findDmParticipant(channelId, userId);

      if (!participant) {
        throw new ForbiddenError("Kamu bukan participant pada conversation ini");
      }

      return 0n;
    }

    if (!serverId) {
      throw new ForbiddenError("Channel tidak terhubung ke server");
    }

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

    if (!hasPermission(channelPermissions, Permission.VIEW_CHANNEL)) {
      throw new ForbiddenError("Kamu tidak memiliki permission VIEW_CHANNEL pada channel ini");
    }

    return channelPermissions;
  }

  private async checkDuplicateThrottle(userId: string, channelId: string, content: string) {
    await connectRedis();

    const normalizedContent = normalizeContentForSpam(content);
    const contentHash = createHash("sha256").update(normalizedContent).digest("hex");
    const key = `anti-spam:duplicate:${userId}:${channelId}:${contentHash}`;
    const throttleKey = `${key}:throttle`;

    const isThrottled = await redisClient.exists(throttleKey);

    if (isThrottled) {
      await this.flagAntiSpamThrottle(userId, channelId, "duplicate_message");

      throw new TooManyRequestsError("Terlalu banyak pesan identik. Silakan coba lagi nanti.");
    }

    const now = Date.now();
    const windowStart = now - DUPLICATE_MESSAGE_WINDOW_SECONDS * 1000;
    const member = `${now}:${randomUUID()}`;

    const pipeline = redisClient.multi();
    pipeline.zRemRangeByScore(key, 0, windowStart);
    pipeline.zAdd(key, {
      score: now,
      value: member,
    });
    pipeline.zCard(key);
    pipeline.expire(key, DUPLICATE_MESSAGE_WINDOW_SECONDS);

    const results = await pipeline.exec();
    const currentCount = Number(results?.[2] ?? 0);

    if (currentCount >= DUPLICATE_MESSAGE_THRESHOLD) {
      await redisClient.set(throttleKey, "1", {
        EX: DUPLICATE_MESSAGE_THROTTLE_SECONDS,
      });

      await this.flagAntiSpamThrottle(userId, channelId, "duplicate_message", currentCount);

      throw new TooManyRequestsError("Terlalu banyak pesan identik. Silakan coba lagi nanti.");
    }
  }

  private async assessMessageWarnings(
    userId: string,
    content: string,
  ): Promise<MessageWarningFlags> {
    const user = await messageRepository.findUserTrustProfile(userId);

    const suspiciousLink = extractUrls(content).length > 0;
    const createdAtMs = user?.createdAt.getTime() ?? 0;
    const accountAgeMs = Date.now() - createdAtMs;
    const emailVerified = user?.emailVerifiedAt !== null && user?.emailVerifiedAt !== undefined;

    return {
      suspiciousLink:
        suspiciousLink && (accountAgeMs < SUSPICIOUS_LINK_ACCOUNT_AGE_MS || !emailVerified),
      antiSpam: {
        duplicate: false,
        throttled: false,
        reviewFlagged: false,
      },
    };
  }

  private async flagAntiSpamThrottle(
    userId: string,
    channelId: string,
    reason: string,
    duplicateCount?: number,
  ) {
    const throttleCounterKey = `anti-spam:throttle-count:${userId}`;

    await connectRedis();

    const throttleCount = await redisClient.incr(throttleCounterKey);

    if (throttleCount === 1) {
      await redisClient.expire(throttleCounterKey, ANTI_SPAM_THROTTLE_REVIEW_WINDOW_SECONDS);
    }

    await auditService.log({
      actorId: userId,
      action: "ANTI_SPAM_THROTTLED",
      targetType: "MESSAGE",
      targetId: channelId,
      metadata: {
        reason,
        channelId,
        duplicateCount,
        throttleCount,
      },
    });

    if (throttleCount >= ANTI_SPAM_REVIEW_THRESHOLD) {
      await auditService.log({
        actorId: userId,
        action: "ANTI_SPAM_REVIEW_FLAGGED",
        targetType: "USER",
        targetId: userId,
        metadata: {
          reason: "repeated_anti_spam_throttle",
          channelId,
          duplicateCount,
          throttleCount,
        },
      });
    }
  }

  private async flagSuspiciousLinkWarning(userId: string, channelId: string) {
    await auditService.log({
      actorId: userId,
      action: "ANTI_SPAM_WARNING",
      targetType: "USER",
      targetId: userId,
      metadata: {
        reason: "suspicious_link",
        channelId,
      },
    });
  }

  private async getMessage(messageId: string) {
    const message = await messageRepository.findServerContext(messageId);

    if (!message) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    return message;
  }
  async authorizeChannelAccess(channelId: string, userId: string): Promise<void> {
    await this.ensureChannelAccess(channelId, userId);
  }
  private async ensureChannelAccess(channelId: string, userId: string) {
    const channel = await messageRepository.findChannelById(channelId);

    if (!channel) {
      throw new NotFoundError("Channel tidak ditemukan");
    }

    if (channel.type === "DM" || channel.type === "GROUP_DM") {
      const participant = await messageRepository.findDmParticipant(channelId, userId);

      if (!participant) {
        throw new ForbiddenError("Kamu bukan participant pada conversation ini");
      }

      return channel;
    }

    if (!channel.serverId) {
      throw new ForbiddenError("Channel tidak memiliki server");
    }

    await this.ensureViewChannelPermission(channel.serverId, channelId, userId);

    return channel;
  }

  async create(channelId: string, userId: string, input: CreateMessageInput) {
    const channel = await this.ensureChannelAccess(channelId, userId);

    if (channel.type === "DM" || channel.type === "GROUP_DM") {
      // DM dan GROUP_DM tidak menggunakan server permission.
    } else {
      if (!channel.serverId) {
        throw new ForbiddenError("Channel tidak memiliki server");
      }

      await this.ensureSendMessagesPermission(channel.serverId, channelId, userId);
    }

    if (input.replyToId) {
      await this.ensureValidReplyTarget(input.replyToId, channelId);
    }

    if (input.threadRootId) {
      await this.ensureValidThreadRoot(input.threadRootId, channelId);
    }

    const mentionedUserIds = parseMentions(input.content);
    const mentionedRoleIds = parseRoleMentions(input.content);

    if (mentionedUserIds.length + mentionedRoleIds.length > 20) {
      if (!channel.serverId) {
        throw new ForbiddenError("Mention terlalu banyak pada conversation ini");
      }

      const permissions = await this.getActorPermissions(channel.serverId, userId);

      if (!hasPermission(permissions, Permission.MENTION_EVERYONE)) {
        throw new ForbiddenError("Kamu tidak memiliki permission MENTION_EVERYONE");
      }
    }

    await this.checkDuplicateThrottle(userId, channelId, input.content);

    const warnings = await this.assessMessageWarnings(userId, input.content);

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

    if (channel.serverId) {
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

        this.runInBackground(
          (async () => {
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

            const connections = await getPresenceConnections(mentionedUserId);

            if (connections === 0) {
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
            }

            return notification;
          })(),
          "create mention notification",
        );
      }
    }

    const messageWithModeration = {
      ...message,
      moderation: warnings,
    };

    if (warnings.suspiciousLink) {
      this.runInBackground(
        this.flagSuspiciousLinkWarning(userId, channelId),
        "flag suspicious link warning",
      );
    }

    return messageWithModeration;
  }
  async forward(messageId: string, userId: string, destinationChannelId: string) {
    const sourceMessage = await messageRepository.findForwardSource(messageId);

    if (!sourceMessage || sourceMessage.isDeleted) {
      throw new NotFoundError("Pesan yang ingin diteruskan tidak ditemukan");
    }

    const sourceChannel = sourceMessage.channel;

    const destinationChannel = await this.getChannel(destinationChannelId);

    await this.ensureChannelAccess(sourceChannel.id, userId);
    await this.ensureChannelAccess(destinationChannel.id, userId);

    const forwardedMessage = await messageRepository.create({
      channelId: destinationChannel.id,
      authorId: userId,
      content: sourceMessage.content,
      replyToId: null,
      threadRootId: null,
      attachments: sourceMessage.attachments.map((attachment) => ({
        fileUrl: attachment.fileUrl,
        thumbnailUrl: attachment.thumbnailUrl,
        fileType: attachment.fileType,
        fileSize: Number(attachment.fileSize),
        fileName: attachment.fileName,
      })),
    });

    this.runInBackground(
      publishWebSocketEvent({
        event: WebSocketEvent.MESSAGE_CREATED,
        data: forwardedMessage,
      }),
      "publish forwarded message.created",
    );

    return forwardedMessage;
  }

  async update(messageId: string, userId: string, input: UpdateMessageInput) {
    const message = await this.getMessage(messageId);

    if (message.isDeleted) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    const isAuthor = message.authorId === userId;

    if (!message.channel.serverId) {
      const participant = await messageRepository.findDmParticipant(message.channel.id, userId);

      if (!participant) {
        throw new ForbiddenError("Kamu bukan participant pada conversation ini");
      }

      if (!isAuthor) {
        throw new ForbiddenError("Kamu tidak dapat mengedit pesan ini");
      }
    } else {
      const permissions = await this.getActorPermissions(message.channel.serverId, userId);

      const canManageMessages = hasPermission(permissions, Permission.MANAGE_MESSAGES);

      if (!isAuthor && !canManageMessages) {
        throw new ForbiddenError("Kamu tidak dapat mengedit pesan ini");
      }
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

    const isAuthor = message.authorId === userId;

    if (!message.channel.serverId) {
      const participant = await messageRepository.findDmParticipant(message.channel.id, userId);

      if (!participant) {
        throw new ForbiddenError("Kamu bukan participant pada conversation ini");
      }

      if (!isAuthor) {
        throw new ForbiddenError("Kamu tidak dapat menghapus pesan ini");
      }
    } else {
      const permissions = await this.getActorPermissions(message.channel.serverId, userId);

      const canManageMessages = hasPermission(permissions, Permission.MANAGE_MESSAGES);

      if (!isAuthor && !canManageMessages) {
        throw new ForbiddenError("Kamu tidak dapat menghapus pesan ini");
      }
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

    if (!message.channel.serverId) {
      const participant = await messageRepository.findDmParticipant(message.channel.id, userId);

      if (!participant) {
        throw new ForbiddenError("Kamu bukan participant pada conversation ini");
      }
    } else {
      const permissions = await this.getActorPermissions(message.channel.serverId, userId);

      if (!hasPermission(permissions, Permission.MANAGE_MESSAGES)) {
        throw new ForbiddenError("Kamu tidak memiliki permission untuk menyematkan pesan");
      }
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

    if (!message.channel.serverId) {
      const participant = await messageRepository.findDmParticipant(message.channel.id, userId);

      if (!participant) {
        throw new ForbiddenError("Kamu bukan participant pada conversation ini");
      }
    } else {
      const permissions = await this.getActorPermissions(message.channel.serverId, userId);

      if (!hasPermission(permissions, Permission.MANAGE_MESSAGES)) {
        throw new ForbiddenError("Kamu tidak memiliki permission untuk melepas sematan pesan");
      }
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
