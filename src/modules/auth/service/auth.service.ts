import { randomUUID } from "node:crypto";

import { ConflictError, UnauthorizedError } from "#shared/errors/app-error";
import { generateAccessToken, generateRefreshToken } from "#utils/jwt";
import { hashPassword, verifyPassword } from "#utils/password";

import { authRepository } from "../repository/auth.repository.js";
import type { LoginInput, RegisterInput } from "../schema/auth.schema.js";

type SessionMetadata = {
  deviceInfo: string | null;
  ipAddress: string | null;
};

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ConflictError("Email sudah terdaftar");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await authRepository.createUser({
      email: data.email,
      username: data.username,
      passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    };
  }

  async login(data: LoginInput, metadata: SessionMetadata) {
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError("Email atau password salah");
    }

    const isPasswordValid = await verifyPassword(user.passwordHash, data.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Email atau password salah");
    }

    const sessionId = randomUUID();

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      sessionId,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      sessionId,
    });

    const refreshTokenHash = await hashPassword(refreshToken);

    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await authRepository.createSession({
      id: sessionId,
      userId: user.id,
      refreshTokenHash,
      expiresAt: refreshTokenExpiresAt,
      deviceInfo: metadata.deviceInfo,
      ipAddress: metadata.ipAddress,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      accessToken,
      refreshToken,
    };
  }
  async logout(sessionId: string, userId: string) {
    const result = await authRepository.revokeSession(sessionId, userId);

    if (result.count === 0) {
      throw new UnauthorizedError("Sesi tidak ditemukan atau sudah dicabut");
    }
  }
}

export const authService = new AuthService();
