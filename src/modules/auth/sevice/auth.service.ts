import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { config } from "#config/env";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "#shared/errors/app-error";
import { authRepository } from "../auth.repository.js";
import type { LoginDto, RegisterDto } from "../auth.schema.js";

export class AuthService {
  private hashRefreshToken(refreshToken: string): string {
    return crypto.createHash("sha256").update(refreshToken).digest("hex");
  }

  private generateAccessToken(payload: {
    userId: string;
    email: string;
    username: string;
    sessionId: string;
    isPlatformAdmin: boolean;
  }): string {
    return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN as any,
    });
  }

  async register(dto: RegisterDto) {
    const existingEmail = await authRepository.findUserByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictError("Email sudah terdaftar");
    }

    const existingUsername = await authRepository.findUserByUsername(
      dto.username
    );
    if (existingUsername) {
      throw new ConflictError("Username sudah digunakan");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await authRepository.createUser({
      email: dto.email,
      username: dto.username,
      passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    };
  }

  async login(
    dto: LoginDto,
    meta: { deviceInfo?: string | undefined; ipAddress?: string | undefined }
  ) {
    const isEmail = dto.emailOrUsername.includes("@");
    const user = isEmail
      ? await authRepository.findUserByEmail(dto.emailOrUsername)
      : await authRepository.findUserByUsername(dto.emailOrUsername);

    // Kredensial salah -> kembalikan error generik (SRS-AUTH-02)
    if (!user) {
      throw new UnauthorizedError("Email/username atau password salah");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Email/username atau password salah");
    }

    if (user.isSuspended) {
      throw new UnauthorizedError("Akun Anda telah ditangguhkan");
    }

    // Penerbitan refresh token & simpan sesi
    const rawRefreshToken = crypto.randomBytes(32).toString("hex");
    const refreshTokenHash = this.hashRefreshToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

    const session = await authRepository.createSession({
      userId: user.id,
      ...(meta.deviceInfo !== undefined ? { deviceInfo: meta.deviceInfo } : {}),
      ...(meta.ipAddress !== undefined ? { ipAddress: meta.ipAddress } : {}),
      refreshTokenHash,
      expiresAt,
    });

    const accessToken = this.generateAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      sessionId: session.id,
      isPlatformAdmin: user.isPlatformAdmin,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        isPlatformAdmin: user.isPlatformAdmin,
      },
      accessToken,
      refreshToken: rawRefreshToken,
      sessionId: session.id,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token wajib disertakan");
    }

    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    const session = await authRepository.findSessionById(refreshTokenHash);
    if (!session || session.revokedAt || new Date() > session.expiresAt) {
      throw new UnauthorizedError("Refresh token tidak valid atau telah dicabut");
    }

    const user = await authRepository.findUserById(session.userId);
    if (!user || user.isSuspended) {
      throw new UnauthorizedError("Pengguna tidak valid atau ditangguhkan");
    }

    const accessToken = this.generateAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      sessionId: session.id,
      isPlatformAdmin: user.isPlatformAdmin,
    });

    return { accessToken };
  }

  async logout(sessionId: string, userId: string) {
    await authRepository.revokeSession(sessionId, userId);
  }

  async getSessions(userId: string) {
    return authRepository.findActiveSessionsByUserId(userId);
  }

  async revokeSession(sessionId: string, userId: string) {
    const result = await authRepository.revokeSession(sessionId, userId);
    if (result.count === 0) {
      throw new NotFoundError("Sesi tidak ditemukan atau telah dicabut");
    }
  }
}

export const authService = new AuthService();
