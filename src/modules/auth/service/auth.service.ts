import { createHash, randomBytes, randomUUID } from "node:crypto";

import { auditService } from "#modules/audit/service/audit.service";
import { loginAttemptService } from "#modules/auth/service/login-attempt.service";
import { ConflictError, TooManyRequestsError, UnauthorizedError } from "#shared/errors/app-error";
import { connectRedis, redisClient } from "#shared/redis/redis.client";
import { generateCsrfToken } from "#utils/csrf";
import { generateAccessToken } from "#utils/jwt";
import { hashPassword, verifyPassword } from "#utils/password";

import { authRepository } from "../repository/auth.repository.js";
import type { LoginInput, RegisterInput } from "../schema/auth.schema.js";

type SessionMetadata = {
  deviceInfo: string | null;
  ipAddress: string | null;
};

const LOGIN_MAX_FAILED_ATTEMPTS = 5;
const LOGIN_LOCK_SECONDS = 15 * 60;
const LOGIN_ATTEMPT_WINDOW_SECONDS = 15 * 60;

const REFRESH_TOKEN_EXPIRES_DAYS = 30;

export class AuthService {
  async register(data: RegisterInput) {
    const existingUserByEmail = await authRepository.findUserByEmail(data.email);

    if (existingUserByEmail) {
      throw new ConflictError("Email sudah terdaftar");
    }

    const existingUserByUsername = await authRepository.findUserByUsername(data.username);

    if (existingUserByUsername) {
      throw new ConflictError("Username sudah digunakan");
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

  private getLoginKey(ipAddress: string | null, email: string) {
    const ip = ipAddress ?? "unknown";
    const normalizedEmail = email.trim().toLowerCase();

    return {
      attemptKey: `auth:login-attempt:${ip}:${normalizedEmail}`,
      lockKey: `auth:login-lock:${ip}:${normalizedEmail}`,
    };
  }

  private async isLoginLocked(ipAddress: string | null, email: string): Promise<boolean> {
    await connectRedis();

    const { lockKey } = this.getLoginKey(ipAddress, email);

    return (await redisClient.exists(lockKey)) === 1;
  }

  private async recordFailedLogin(ipAddress: string | null, email: string) {
    await connectRedis();

    const { attemptKey, lockKey } = this.getLoginKey(ipAddress, email);

    const attempts = await redisClient.incr(attemptKey);

    if (attempts === 1) {
      await redisClient.expire(attemptKey, LOGIN_ATTEMPT_WINDOW_SECONDS);
    }

    if (attempts >= LOGIN_MAX_FAILED_ATTEMPTS) {
      await redisClient.set(lockKey, "1", {
        EX: LOGIN_LOCK_SECONDS,
      });

      await redisClient.del(attemptKey);
    }
  }

  private generateRefreshToken(): string {
    return randomBytes(32).toString("hex");
  }

  async login(data: LoginInput, metadata: SessionMetadata) {
    const isLocked = await this.isLoginLocked(metadata.ipAddress, data.email);

    if (isLocked) {
      throw new TooManyRequestsError("Login sementara dikunci. Silakan coba lagi dalam 15 menit.");
    }

    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      const attempt = await loginAttemptService.recordFailure(metadata.ipAddress, data.email);

      await this.recordFailedLogin(metadata.ipAddress, data.email);

      await auditService.log({
        actorId: null,
        action: "auth.login_failed",
        targetType: "user",
        targetId: "unknown",
        metadata: {
          reason: "user_not_found",
          email: data.email,
          ipAddress: metadata.ipAddress,
          deviceInfo: metadata.deviceInfo,
          attempts: attempt.attempts,
          locked: attempt.locked,
        },
      });

      throw new UnauthorizedError("Email atau password salah");
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedError("Email belum diverifikasi");
    }

    const isPasswordValid = await verifyPassword(user.passwordHash, data.password);

    if (!isPasswordValid) {
      await this.recordFailedLogin(metadata.ipAddress, data.email);

      await auditService.log({
        actorId: user.id,
        action: "auth.login_failed",
        targetType: "user",
        targetId: user.id,
        metadata: {
          reason: "invalid_password",
          ipAddress: metadata.ipAddress,
          deviceInfo: metadata.deviceInfo,
        },
      });

      throw new UnauthorizedError("Email atau password salah");
    }

    await loginAttemptService.clearFailures(metadata.ipAddress, data.email);

    const sessionId = randomUUID();

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      sessionId,
    });

    const refreshToken = this.generateRefreshToken();

    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    const refreshTokenExpiresAt = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    );

    await authRepository.createSession({
      id: sessionId,
      userId: user.id,
      refreshTokenHash,
      expiresAt: refreshTokenExpiresAt,
      deviceInfo: metadata.deviceInfo,
      ipAddress: metadata.ipAddress,
    });

    await auditService.log({
      actorId: user.id,
      action: "auth.login_success",
      targetType: "user",
      targetId: user.id,
      metadata: {
        sessionId,
        ipAddress: metadata.ipAddress,
        deviceInfo: metadata.deviceInfo,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      accessToken,
      refreshToken,
      csrfToken: generateCsrfToken(sessionId),
    };
  }

  async logout(refreshToken: string) {
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    const session = await authRepository.findSessionByRefreshTokenHash(refreshTokenHash);

    if (!session) {
      throw new UnauthorizedError("Refresh token tidak valid atau sesi tidak ditemukan");
    }

    const result = await authRepository.revokeSession(session.id, session.userId);

    if (result.count === 0) {
      throw new UnauthorizedError("Sesi tidak ditemukan atau sudah dicabut");
    }

    await auditService.log({
      actorId: session.userId,
      action: "auth.logout",
      targetType: "session",
      targetId: session.id,
      metadata: {
        userId: session.userId,
      },
    });
  }

  async refresh(refreshToken: string) {
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    const session = await authRepository.findSessionByRefreshTokenHash(refreshTokenHash);

    if (!session) {
      throw new UnauthorizedError("Refresh token tidak valid");
    }

    if (session.revokedAt) {
      throw new UnauthorizedError("Sesi sudah dicabut");
    }

    if (session.expiresAt <= new Date()) {
      throw new UnauthorizedError("Refresh token sudah kedaluwarsa");
    }

    const newAccessToken = generateAccessToken({
      userId: session.user.id,
      email: session.user.email,
      username: session.user.username,
      sessionId: session.id,
    });

    const newRefreshToken = this.generateRefreshToken();

    const newRefreshTokenHash = this.hashRefreshToken(newRefreshToken);

    await authRepository.updateSessionRefreshToken(
      session.id,
      newRefreshTokenHash,
      session.expiresAt,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      csrfToken: generateCsrfToken(session.id),
    };
  }
  private hashRefreshToken(refreshToken: string): string {
    return createHash("sha256").update(refreshToken).digest("hex");
  }
}

export const authService = new AuthService();
