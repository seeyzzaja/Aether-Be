import prisma from "#utils/prisma";

export class UploadRepository {
  async findChannelContext(channelId: string) {
    return prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        id: true,
        type: true,
        serverId: true,
        server: {
          select: {
            id: true,
            ownerId: true,
          },
        },
      },
    });
  }

  async findDmParticipant(channelId: string, userId: string) {
    return prisma.dmParticipant.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
      select: {
        channelId: true,
        userId: true,
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
        id: true,
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
}

export const uploadRepository = new UploadRepository();
