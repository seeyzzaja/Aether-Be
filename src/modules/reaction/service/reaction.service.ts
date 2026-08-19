import { messageRepository } from "#modules/message/repository/message.repository";
import { reactionRepository } from "#modules/reaction/repository/reaction.repository";

import { ConflictError, ForbiddenError, NotFoundError } from "#shared/errors/app-error";
import { broadcastReactionAdded, broadcastReactionRemoved } from "#websocket/broadcast";
export class ReactionService {
  private async getMessage(messageId: string) {
    const message = await messageRepository.findServerContext(messageId);

    if (!message) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    if (message.isDeleted) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    return message;
  }

  async add(messageId: string, userId: string, emoji: string) {
    const message = await this.getMessage(messageId);

    if (!message.channel.serverId) {
      const participant = await messageRepository.findDmParticipant(message.channel.id, userId);

      if (!participant) {
        throw new ForbiddenError("Kamu bukan participant pada conversation ini");
      }
    } else {
      await this.ensureServerMember(message.channel.serverId, userId);
    }

    try {
      const reaction = await reactionRepository.create({
        messageId,
        userId,
        emoji,
      });

      broadcastReactionAdded(message.channel.id, reaction);

      return reaction;
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof error.code === "string" &&
        error.code === "P2002"
      ) {
        throw new ConflictError("Kamu sudah memberikan reaksi emoji tersebut pada pesan ini");
      }

      throw error;
    }
  }

  async remove(messageId: string, userId: string, emoji: string) {
    const message = await this.getMessage(messageId);

    if (!message.channel.serverId) {
      const participant = await messageRepository.findDmParticipant(message.channel.id, userId);

      if (!participant) {
        throw new ForbiddenError("Kamu bukan participant pada conversation ini");
      }
    } else {
      await this.ensureServerMember(message.channel.serverId, userId);
    }

    const existingReaction = await reactionRepository.findByMessageUserEmoji(
      messageId,
      userId,
      emoji,
    );

    if (!existingReaction) {
      throw new NotFoundError("Reaksi tidak ditemukan");
    }

    const reaction = await reactionRepository.delete(messageId, userId, emoji);

    broadcastReactionRemoved(message.channel.id, reaction);

    return reaction;
  }

  async list(messageId: string, userId: string) {
    const message = await this.getMessage(messageId);

    if (!message.channel.serverId) {
      const participant = await messageRepository.findDmParticipant(message.channel.id, userId);

      if (!participant) {
        throw new ForbiddenError("Kamu bukan participant pada conversation ini");
      }
    } else {
      await this.ensureServerMember(message.channel.serverId, userId);
    }

    return reactionRepository.findByMessageId(messageId);
  }
  private async ensureServerMember(serverId: string, userId: string) {
    const member = await messageRepository.findServerMember(serverId, userId);

    if (!member) {
      throw new ForbiddenError("Kamu bukan member dari server ini");
    }
  }
}

export const reactionService = new ReactionService();
