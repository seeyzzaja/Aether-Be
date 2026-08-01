import prisma from "#utils/prisma";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: {
    email: string;
    username: string;
    passwordHash: string;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash: data.passwordHash,
      },
    });
  }

  async createSession(data: {
    userId: string;
    deviceInfo?: string | undefined;
    ipAddress?: string | undefined;
    refreshTokenHash: string;
    expiresAt: Date;
  }) {
    return prisma.session.create({
      data: {
        userId: data.userId,
        ...(data.deviceInfo !== undefined ? { deviceInfo: data.deviceInfo } : {}),
        ...(data.ipAddress !== undefined ? { ipAddress: data.ipAddress } : {}),
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findSessionById(sessionId: string) {
    return prisma.session.findUnique({
      where: { id: sessionId },
    });
  }

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
        createdAt: true,
        expiresAt: true,
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

  async revokeAllUserSessions(userId: string) {
    return prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async updateSessionRefreshToken(sessionId: string, newRefreshTokenHash: string, newExpiresAt: Date) {
    return prisma.session.update({
      where: { id: sessionId },
      data: {
        refreshTokenHash: newRefreshTokenHash,
        expiresAt: newExpiresAt,
      },
    });
  }
}

export const authRepository = new AuthRepository();
