import prisma from "#utils/prisma";

export class MessageRepository {
  async create(data: {
    channelId: string;
    authorId: string;
    content: string;
    replyToId?: string | null;
    threadRootId?: string | null;
  }) {
    return prisma.message.create({
      data: {
        channelId: data.channelId,
        authorId: data.authorId,
        content: data.content,
        replyToId: data.replyToId ?? null,
        threadRootId: data.threadRootId ?? null,
      },
    });
  }

  async findById(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });
  }

  async findByIdWithChannel(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        channel: true,
      },
    });
  }

  async findReplyTarget(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
      select: {
        id: true,
        channelId: true,
        authorId: true,
        content: true,
        isDeleted: true,
      },
    });
  }

  async update(
    messageId: string,
    data: {
      content?: string;
      isPinned?: boolean;
    },
  ) {
    return prisma.message.update({
      where: {
        id: messageId,
      },
      data,
    });
  }

  async softDelete(messageId: string) {
    return prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async findByChannelId(
    channelId: string,
    options?: {
      limit?: number;
      cursor?: string;
    },
  ) {
    const limit = options?.limit ?? 50;

    return prisma.message.findMany({
      where: {
        channelId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      ...(options?.cursor && {
        cursor: {
          id: options.cursor,
        },
        skip: 1,
      }),
    });
  }
  async findServerContext(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
      select: {
        id: true,
        channelId: true,
        authorId: true,
        content: true,
        isPinned: true,
        isDeleted: true,
        channel: {
          select: {
            id: true,
            serverId: true,
          },
        },
      },
    });
  }

  async findMemberPermissions(serverId: string, userId: string) {
    return prisma.serverMember.findUnique({
      where: {
        serverId_userId: {
          serverId,
          userId,
        },
      },
      select: {
        roles: {
          select: {
            role: {
              select: {
                permissionsBitmask: true,
              },
            },
          },
        },
      },
    });
  }

  async findServerOwner(serverId: string) {
    return prisma.server.findUnique({
      where: {
        id: serverId,
      },
      select: {
        ownerId: true,
      },
    });
  }
  async findChannelById(channelId: string) {
    return prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        id: true,
        serverId: true,
      },
    });
  }
  async findServerMember(serverId: string, userId: string) {
    return prisma.serverMember.findUnique({
      where: {
        serverId_userId: {
          serverId,
          userId,
        },
      },
      select: {
        userId: true,
      },
    });
  }
}

export const messageRepository = new MessageRepository();
