import prisma from "#utils/prisma";

export class ReactionRepository {
  async create(data: { messageId: string; userId: string; emoji: string }) {
    return prisma.reaction.create({
      data: {
        messageId: data.messageId,
        userId: data.userId,
        emoji: data.emoji,
      },
    });
  }

  async findByMessageUserEmoji(messageId: string, userId: string, emoji: string) {
    return prisma.reaction.findUnique({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji,
        },
      },
    });
  }

  async delete(messageId: string, userId: string, emoji: string) {
    return prisma.reaction.delete({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji,
        },
      },
    });
  }

  async findByMessageId(messageId: string) {
    return prisma.reaction.findMany({
      where: {
        messageId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}

export const reactionRepository = new ReactionRepository();
