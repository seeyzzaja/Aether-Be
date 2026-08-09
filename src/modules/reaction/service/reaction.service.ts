import { messageRepository } from "#modules/message/repository/message.repository.js";
import { reactionRepository } from "#modules/reaction/repository/reaction.repository.js";
import { Prisma } from "#prisma/generated/prisma/client.js";
import { ConflictError, ForbiddenError, NotFoundError } from "#shared/errors/app-error.js";
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

    await this.ensureServerMember(message.channel.serverId, userId);

    try {
      const reaction = await reactionRepository.create({
        messageId,
        userId,
        emoji,
      });

      broadcastReactionAdded(message.channel.id, reaction);

      return reaction;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictError("Kamu sudah memberikan reaksi emoji tersebut pada pesan ini");
      }

      throw error;
    }
  }

  async remove(messageId: string, userId: string, emoji: string) {
    const message = await this.getMessage(messageId);

    await this.ensureServerMember(message.channel.serverId, userId);

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

  async list(messageId: string) {
    await this.getMessage(messageId);

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
