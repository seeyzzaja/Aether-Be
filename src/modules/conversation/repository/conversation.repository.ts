import prisma from "#utils/prisma";

const participantSelect = {
  user: {
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const;

export class ConversationRepository {
  async findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        dmPrivacy: true,
      },
    });
  }

  async findConversationById(conversationId: string) {
    return prisma.channel.findUnique({
      where: { id: conversationId },
      include: {
        dmParticipants: {
          include: participantSelect,
          orderBy: {
            joinedAt: "asc",
          },
        },
      },
    });
  }

  async findConversationParticipants(conversationId: string) {
    return prisma.dmParticipant.findMany({
      where: { channelId: conversationId },
      include: participantSelect,
      orderBy: {
        joinedAt: "asc",
      },
    });
  }

  async findDirectMessagePair(userId: string, targetUserId: string) {
    const conversations = await prisma.channel.findMany({
      where: {
        type: "DM",
        serverId: null,
        dmParticipants: {
          some: {
            userId: {
              in: [userId, targetUserId],
            },
          },
        },
      },
      include: {
        dmParticipants: {
          include: participantSelect,
          orderBy: {
            joinedAt: "asc",
          },
        },
      },
    });

    return (
      conversations.find((conversation) => {
        const participantIds = conversation.dmParticipants.map(
          (participant) => participant.user.id,
        );

        return (
          participantIds.length === 2 &&
          participantIds.includes(userId) &&
          participantIds.includes(targetUserId)
        );
      }) ?? null
    );
  }

  async findConversationByParticipant(conversationId: string, userId: string) {
    return prisma.channel.findFirst({
      where: {
        id: conversationId,
        type: {
          in: ["DM", "GROUP_DM"],
        },
        serverId: null,
        dmParticipants: {
          some: {
            userId,
          },
        },
      },
      include: {
        dmParticipants: {
          include: participantSelect,
          orderBy: {
            joinedAt: "asc",
          },
        },
      },
    });
  }

  async findConversationsByUserId(userId: string) {
    const conversations = await prisma.channel.findMany({
      where: {
        type: {
          in: ["DM", "GROUP_DM"],
        },
        serverId: null,
        dmParticipants: {
          some: {
            userId,
          },
        },
      },
      include: {
        dmParticipants: {
          include: participantSelect,
          orderBy: {
            joinedAt: "asc",
          },
        },
      },
    });

    return conversations.sort((a, b) => {
      const aLatest = Math.max(
        ...a.dmParticipants.map((participant) => participant.joinedAt.getTime()),
      );
      const bLatest = Math.max(
        ...b.dmParticipants.map((participant) => participant.joinedAt.getTime()),
      );

      return bLatest - aLatest;
    });
  }

  async createConversation(data: {
    type: "DM" | "GROUP_DM";
    name: string;
    participantIds: string[];
  }) {
    return prisma.channel.create({
      data: {
        type: data.type,
        name: data.name,
        serverId: null,
        categoryId: null,
        dmParticipants: {
          create: data.participantIds.map((userId) => ({ userId })),
        },
      },
      include: {
        dmParticipants: {
          include: participantSelect,
          orderBy: {
            joinedAt: "asc",
          },
        },
      },
    });
  }
}

export const conversationRepository = new ConversationRepository();
