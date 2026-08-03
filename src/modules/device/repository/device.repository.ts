import prisma from "#utils/prisma";

export class DeviceRepository {
  async findActiveSessionsByUserId(userId: string) {
    return prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async revokeSession(sessionId: string, userId: string) {
    return prisma.session.updateMany({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}

export const deviceRepository = new DeviceRepository();
