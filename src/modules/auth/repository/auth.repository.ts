import prisma from "#utils/prisma";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findSessionById(sessionId: string) {
    return prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
  }

  async createUser(data: { email: string; username: string; passwordHash: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash: data.passwordHash,
      },
    });
  }

  async createSession(data: {
    id: string;
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    deviceInfo: string | null;
    ipAddress: string | null;
  }) {
    return prisma.session.create({
      data: {
        id: data.id,
        userId: data.userId,
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
        deviceInfo: data.deviceInfo,
        ipAddress: data.ipAddress,
      },
    });
  }

  async findActiveSessionsByUserId(userId: string) {
    return prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
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

  async updateSessionRefreshToken(sessionId: string, refreshTokenHash: string, expiresAt: Date) {
    return prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        refreshTokenHash,
        expiresAt,
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

export const authRepository = new AuthRepository();
