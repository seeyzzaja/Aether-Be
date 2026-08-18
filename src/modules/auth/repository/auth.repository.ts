import type { AuthTokenType, OAuthProvider } from "#prisma/generated/prisma/client";
import prisma from "#utils/prisma";

export class AuthRepository {
  async findUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

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

  async createUser(data: {
    email: string;
    username: string;
    passwordHash: string | null;
    emailVerifiedAt?: Date | null;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash: data.passwordHash,
        emailVerifiedAt: data.emailVerifiedAt ?? null,
      },
    });
  }

  async createUserWithUniqueUsername(data: {
    email: string;
    username: string;
    passwordHash: string | null;
    emailVerifiedAt?: Date | null;
  }) {
    return this.createUser(data);
  }

  async updateUserPassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });
  }

  async verifyUserEmail(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerifiedAt: new Date(),
      },
    });
  }

  async createAuthToken(data: {
    userId: string;
    type: AuthTokenType;
    tokenHash: string;
    expiresAt: Date;
  }) {
    return prisma.authToken.create({
      data: {
        userId: data.userId,
        type: data.type,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findValidAuthToken(tokenHash: string, type: AuthTokenType) {
    return prisma.authToken.findFirst({
      where: {
        tokenHash,
        type,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async markAuthTokenUsed(tokenId: string) {
    return prisma.authToken.update({
      where: {
        id: tokenId,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async invalidateAuthTokens(userId: string, type: AuthTokenType) {
    return prisma.authToken.updateMany({
      where: {
        userId,
        type,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
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

  async findSessionByRefreshTokenHash(refreshTokenHash: string) {
    return prisma.session.findFirst({
      where: {
        refreshTokenHash,
        revokedAt: null,
      },
      include: {
        user: true,
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

  async findOAuthAccount(provider: OAuthProvider, providerAccountId: string) {
    return prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async findOAuthAccountWithUser(provider: OAuthProvider, providerAccountId: string) {
    return this.findOAuthAccount(provider, providerAccountId);
  }

  async createOAuthAccount(userId: string, provider: OAuthProvider, providerAccountId: string) {
    return prisma.oAuthAccount.create({
      data: {
        userId,
        provider,
        providerAccountId,
      },
    });
  }

  async findUserByOAuthProvider(provider: OAuthProvider) {
    return prisma.user.findFirst({
      where: {
        oauthAccounts: {
          some: {
            provider,
          },
        },
      },
    });
  }

  async findUserByEmailWithOAuthAccounts(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        oauthAccounts: true,
      },
    });
  }

  async updateUserEmailVerifiedAt(userId: string, emailVerifiedAt: Date) {
    return prisma.user.update({
      where: { id: userId },
      data: { emailVerifiedAt },
    });
  }
}

export const authRepository = new AuthRepository();
