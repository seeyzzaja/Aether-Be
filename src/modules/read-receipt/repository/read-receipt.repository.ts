import prisma from "#utils/prisma";

export const readReceiptRepository = {
  findChannel(channelId: string) {
    return prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        id: true,
      },
    });
  },

  findMessage(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
      select: {
        id: true,
        channelId: true,
        isDeleted: true,
      },
    });
  },

  upsertReadState(userId: string, channelId: string, messageId: string) {
    return prisma.channelReadState.upsert({
      where: {
        userId_channelId: {
          userId,
          channelId,
        },
      },
      create: {
        userId,
        channelId,
        lastReadMessageId: messageId,
      },
      update: {
        lastReadMessageId: messageId,
        readAt: new Date(),
      },
      include: {
        message: {
          select: {
            id: true,
          },
        },
      },
    });
  },

  findReadState(userId: string, channelId: string) {
    return prisma.channelReadState.findUnique({
      where: {
        userId_channelId: {
          userId,
          channelId,
        },
      },
      include: {
        message: {
          select: {
            id: true,
          },
        },
      },
    });
  },
};
