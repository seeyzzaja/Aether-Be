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
  }) {
    return prisma.session.create({
      data: {
        id: data.id,
        userId: data.userId,
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
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
}

export const authRepository = new AuthRepository();
