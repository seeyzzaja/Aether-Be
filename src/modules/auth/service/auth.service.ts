import { createHash, randomBytes, randomInt, randomUUID } from "node:crypto";
import { auditService } from "#modules/audit/service/audit.service";
import { authRepository } from "#modules/auth/repository/auth.repository";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "#modules/auth/schema/auth.schema";
import { loginAttemptService } from "#modules/auth/service/login-attempt.service";
import { sendEmail } from "#shared/email/email.service";
import { ConflictError, TooManyRequestsError, UnauthorizedError } from "#shared/errors/app-error";
import { logger } from "#shared/logger/logger";
import { connectRedis, redisClient } from "#shared/redis/redis.client";
import { generateCsrfToken } from "#utils/csrf";
import { generateAccessToken } from "#utils/jwt";
import { hashPassword, verifyPassword } from "#utils/password";
import prisma from "#utils/prisma";
import {
  createOAuthAuthorizationUrl,
  createOAuthStatePayload,
  createOAuthStateToken,
  decodeOAuthStatePayload,
  encodeOAuthStatePayload,
  fetchOAuthIdentity,
  oauthStateTtlSeconds,
} from "./oauth.providers.js";

type SessionMetadata = {
  deviceInfo: string | null;
  ipAddress: string | null;
};

const AUTH_CODE_EXPIRES_MINUTES = 10;

const LOGIN_MAX_FAILED_ATTEMPTS = 5;
const LOGIN_LOCK_SECONDS = 15 * 60;
const LOGIN_ATTEMPT_WINDOW_SECONDS = 15 * 60;

const REFRESH_TOKEN_EXPIRES_DAYS = 30;

function sha256Short(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export class AuthService {
  /**
   * Generate 6 digit verification code.
   */
  private generateVerificationCode(): string {
    return randomInt(100000, 1000000).toString();
  }

  /**
   * Hash verification/reset code before storing it.
   */
  private hashAuthCode(code: string): string {
    return createHash("sha256").update(code).digest("hex");
  }

  /**
   * Verification/reset code expires after 10 minutes.
   */
  private getAuthCodeExpiresAt(): Date {
    return new Date(Date.now() + AUTH_CODE_EXPIRES_MINUTES * 60 * 1000);
  }

  /**
   * Register normal account.
   *
   * Flow:
   * 1. Check email.
   * 2. Check username.
   * 3. Hash password.
   * 4. Create user.
   * 5. Generate verification code.
   * 6. Store hashed code.
   * 7. Send verification email.
   */
  async register(data: RegisterInput) {
    const email = data.email.trim().toLowerCase();
    const username = data.username.trim();

    const existingUserByEmail = await authRepository.findUserByEmail(email);

    if (existingUserByEmail) {
      throw new ConflictError("Email sudah terdaftar");
    }

    const existingUserByUsername = await authRepository.findUserByUsername(username);

    if (existingUserByUsername) {
      throw new ConflictError("Username sudah digunakan");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await authRepository.createUser({
      email,
      username,
      passwordHash,
    });

    const code = this.generateVerificationCode();

    await authRepository.createAuthToken({
      userId: user.id,
      type: "EMAIL_VERIFICATION",
      tokenHash: this.hashAuthCode(code),
      expiresAt: this.getAuthCodeExpiresAt(),
    });

    await sendEmail({
      to: user.email,
      subject: "Verifikasi Email Aether",
      text: [
        `Kode verifikasi email Aether kamu adalah ${code}.`,
        `Kode berlaku selama ${AUTH_CODE_EXPIRES_MINUTES} menit.`,
      ].join(" "),
      html: `
        <h2>Verifikasi Email Aether</h2>

        <p>
          Gunakan kode berikut untuk memverifikasi email kamu:
        </p>

        <h1>${code}</h1>

        <p>
          Kode berlaku selama
          ${AUTH_CODE_EXPIRES_MINUTES} menit.
        </p>

        <p>
          Jika kamu tidak membuat akun Aether,
          abaikan email ini.
        </p>
      `,
    });

    await auditService.log({
      actorId: user.id,
      action: "auth.register",
      targetType: "user",
      targetId: user.id,
      metadata: {
        email: user.email,
        username: user.username,
      },
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      emailVerified: false,
      createdAt: user.createdAt,
    };
  }

  /**
   * Login rate-limit key.
   */
  private getLoginKey(ipAddress: string | null, email: string) {
    const ip = ipAddress ?? "unknown";
    const normalizedEmail = email.trim().toLowerCase();

    return {
      attemptKey: `auth:login-attempt:${ip}:${normalizedEmail}`,
      lockKey: `auth:login-lock:${ip}:${normalizedEmail}`,
    };
  }

  /**
   * Check whether login is currently locked.
   */
  private async isLoginLocked(ipAddress: string | null, email: string): Promise<boolean> {
    await connectRedis();

    const { lockKey } = this.getLoginKey(ipAddress, email);

    return (await redisClient.exists(lockKey)) === 1;
  }

  /**
   * Record failed login attempt.
   */
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

  /**
   * Generate random refresh token.
   */
  private generateRefreshToken(): string {
    return randomBytes(32).toString("hex");
  }

  /**
   * Hash refresh token before storing it.
   */
  private hashRefreshToken(refreshToken: string): string {
    return createHash("sha256").update(refreshToken).digest("hex");
  }

  /**
   * Normal email/password login.
   */
  async login(data: LoginInput, metadata: SessionMetadata) {
    const email = data.email.trim().toLowerCase();

    const isLocked = await this.isLoginLocked(metadata.ipAddress, email);

    if (isLocked) {
      throw new TooManyRequestsError("Login sementara dikunci. Silakan coba lagi dalam 15 menit.");
    }

    const user = await authRepository.findUserByEmail(email);

    /**
     * User does not exist.
     */
    if (!user) {
      const attempt = await loginAttemptService.recordFailure(metadata.ipAddress, email);

      await this.recordFailedLogin(metadata.ipAddress, email);

      await auditService.log({
        actorId: null,
        action: "auth.login_failed",
        targetType: "user",
        targetId: "unknown",
        metadata: {
          reason: "user_not_found",
          email,
          ipAddress: metadata.ipAddress,
          deviceInfo: metadata.deviceInfo,
          attempts: attempt.attempts,
          locked: attempt.locked,
        },
      });

      throw new UnauthorizedError("Email atau password salah");
    }

    /**
     * Normal account must verify email first.
     */
    if (!user.emailVerifiedAt) {
      throw new UnauthorizedError("Email belum diverifikasi");
    }

    if (!user.passwordHash) {
      throw new UnauthorizedError("Akun ini menggunakan login OAuth");
    }

    const isPasswordValid = await verifyPassword(user.passwordHash, data.password);

    if (!isPasswordValid) {
      const attempt = await loginAttemptService.recordFailure(metadata.ipAddress, email);

      await this.recordFailedLogin(metadata.ipAddress, email);

      await auditService.log({
        actorId: user.id,
        action: "auth.login_failed",
        targetType: "user",
        targetId: user.id,
        metadata: {
          reason: "invalid_password",
          ipAddress: metadata.ipAddress,
          deviceInfo: metadata.deviceInfo,
          attempts: attempt.attempts,
          locked: attempt.locked,
        },
      });

      throw new UnauthorizedError("Email atau password salah");
    }

    await loginAttemptService.clearFailures(metadata.ipAddress, email);

    return this.createAuthenticatedSession(user, metadata);
  }

  private async getUniqueUsername(seed: string) {
    const normalized = seed
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 24);

    const base = normalized.length >= 3 ? normalized : "user";

    for (let suffix = 0; suffix < 1000; suffix += 1) {
      const candidate = suffix === 0 ? base : `${base}_${suffix}`;
      if (candidate.length > 30) continue;
      const existing = await authRepository.findUserByUsername(candidate);
      if (!existing) {
        return candidate;
      }
    }

    throw new ConflictError("Gagal membuat username unik");
  }

  async createOAuthLoginUrl(provider: "GOOGLE" | "GITHUB" | "FACEBOOK") {
    const stateToken = createOAuthStateToken();
    const payload = createOAuthStatePayload(provider);
    const stateKey = `auth:oauth-state:${stateToken}`;

    await connectRedis();
    await redisClient.set(stateKey, encodeOAuthStatePayload(payload), {
      EX: oauthStateTtlSeconds,
    });

    logger.debug(
      {
        event: "[OAUTH STATE CREATE]",
        provider,
        stateHash: sha256Short(stateToken),
        redisKeyHash: sha256Short(stateKey),
        redisStored: true,
        ttl: oauthStateTtlSeconds,
        createdAt: payload.createdAt,
        redisInstance: "shared:redisClient",
      },
      "OAuth state stored",
    );

    return createOAuthAuthorizationUrl(provider, stateToken);
  }

  async handleOAuthCallback(
    provider: "GOOGLE" | "GITHUB" | "FACEBOOK",
    code: string,
    state: string,
    metadata: SessionMetadata,
  ) {
    await connectRedis();

    const stateKey = `auth:oauth-state:${state}`;
    const stateHash = sha256Short(state);
    const rawState = await redisClient.get(stateKey);
    const ttl = await redisClient.ttl(stateKey);

    if (!state) {
      logger.warn(
        {
          event: "[OAUTH STATE CALLBACK]",
          provider,
          stateHash,
          redisKeyHash: sha256Short(stateKey),
          redisFound: false,
          rawValueLength: 0,
          rawValueHash: null,
          decodeSuccess: false,
          ttl,
          callbackAt: Date.now(),
          redisInstance: "shared:redisClient",
          reason: "missing_state",
        },
        "OAuth callback missing state",
      );
      throw new UnauthorizedError("State OAuth tidak valid atau kedaluwarsa");
    }

    logger.debug(
      {
        event: "[OAUTH STATE CALLBACK]",
        provider,
        stateHash,
        redisKeyHash: sha256Short(stateKey),
        redisFound: Boolean(rawState),
        rawValueLength: rawState?.length ?? 0,
        rawValueHash: rawState ? sha256Short(rawState) : null,
        decodeSuccess: false,
        ttl,
        callbackAt: Date.now(),
        redisInstance: "shared:redisClient",
      },
      "OAuth callback state lookup",
    );

    if (!rawState) {
      logger.warn(
        {
          event: "[OAUTH STATE CALLBACK]",
          provider,
          stateHash,
          redisKeyHash: sha256Short(stateKey),
          redisFound: false,
          rawValueLength: 0,
          rawValueHash: null,
          decodeSuccess: false,
          ttl,
          callbackAt: Date.now(),
          redisInstance: "shared:redisClient",
          reason: ttl === -2 ? "state_missing" : "state_expired_or_missing",
        },
        "OAuth state not found",
      );
      throw new UnauthorizedError("State OAuth tidak valid atau kedaluwarsa");
    }

    await redisClient.del(stateKey);

    let parsedState: ReturnType<typeof decodeOAuthStatePayload>;

    try {
      parsedState = decodeOAuthStatePayload(rawState);
      logger.debug(
        {
          event: "[OAUTH STATE CALLBACK]",
          provider,
          stateHash,
          redisKeyHash: sha256Short(stateKey),
          redisFound: true,
          rawValueLength: rawState.length,
          rawValueHash: sha256Short(rawState),
          decodeSuccess: true,
          ttl,
          callbackAt: Date.now(),
          redisInstance: "shared:redisClient",
        },
        "OAuth state decode success",
      );
    } catch (error) {
      logger.warn(
        {
          event: "[OAUTH STATE CALLBACK]",
          provider,
          stateHash,
          redisKeyHash: sha256Short(stateKey),
          redisFound: true,
          rawValueLength: rawState.length,
          rawValueHash: sha256Short(rawState),
          decodeSuccess: false,
          ttl,
          callbackAt: Date.now(),
          redisInstance: "shared:redisClient",
          reason: "json_parse_failed",
        },
        "OAuth state decode failed",
      );
      throw error;
    }

    if (parsedState.provider !== provider) {
      logger.warn(
        {
          event: "[OAUTH STATE CALLBACK]",
          provider,
          stateHash,
          redisKeyHash: sha256Short(stateKey),
          redisFound: true,
          rawValueLength: rawState.length,
          rawValueHash: sha256Short(rawState),
          decodeSuccess: true,
          ttl,
          callbackAt: Date.now(),
          redisInstance: "shared:redisClient",
          reason: "provider_mismatch",
          storedProvider: parsedState.provider,
        },
        "OAuth state provider mismatch",
      );
      throw new UnauthorizedError("State OAuth tidak cocok dengan provider");
    }

    const identity = await fetchOAuthIdentity(provider, code);

    if (identity.providerAccountId.trim().length === 0) {
      throw new UnauthorizedError("Provider account ID tidak valid");
    }

    const existingAccount = await authRepository.findOAuthAccountWithUser(
      provider,
      identity.providerAccountId,
    );

    if (existingAccount?.user) {
      await auditService.log({
        actorId: existingAccount.user.id,
        action: "auth.oauth_login_success",
        targetType: "user",
        targetId: existingAccount.user.id,
        metadata: {
          provider,
          ipAddress: metadata.ipAddress,
          deviceInfo: metadata.deviceInfo,
        },
      });

      return this.createAuthenticatedSession(
        {
          id: existingAccount.user.id,
          email: existingAccount.user.email,
          username: existingAccount.user.username,
        },
        metadata,
      );
    }

    const normalizedEmail = identity.email.trim().toLowerCase();
    const userByEmail = await authRepository.findUserByEmailWithOAuthAccounts(normalizedEmail);

    const username = await this.getUniqueUsername(
      `${provider.toLowerCase()}_${identity.usernameSeed}`,
    );

    if (userByEmail) {
      const linkedProviders = userByEmail.oauthAccounts.map((account) => account.provider);
      if (!linkedProviders.includes(provider)) {
        await authRepository.createOAuthAccount(
          userByEmail.id,
          provider,
          identity.providerAccountId,
        );

        await auditService.log({
          actorId: userByEmail.id,
          action: "auth.oauth_account_linked",
          targetType: "user",
          targetId: userByEmail.id,
          metadata: {
            provider,
            ipAddress: metadata.ipAddress,
            deviceInfo: metadata.deviceInfo,
          },
        });
      }

      if (identity.emailVerified && !userByEmail.emailVerifiedAt) {
        await authRepository.updateUserEmailVerifiedAt(userByEmail.id, new Date());
      }

      await auditService.log({
        actorId: userByEmail.id,
        action: "auth.oauth_login_success",
        targetType: "user",
        targetId: userByEmail.id,
        metadata: {
          provider,
          ipAddress: metadata.ipAddress,
          deviceInfo: metadata.deviceInfo,
        },
      });

      return this.createAuthenticatedSession(
        {
          id: userByEmail.id,
          email: userByEmail.email,
          username: userByEmail.username,
        },
        metadata,
      );
    }

    const user = await authRepository.createUser({
      email: normalizedEmail,
      username,
      passwordHash: null,
      emailVerifiedAt: identity.emailVerified ? new Date() : null,
    });

    await authRepository.createOAuthAccount(user.id, provider, identity.providerAccountId);

    await auditService.log({
      actorId: user.id,
      action: "auth.oauth_account_linked",
      targetType: "user",
      targetId: user.id,
      metadata: {
        provider,
        ipAddress: metadata.ipAddress,
        deviceInfo: metadata.deviceInfo,
      },
    });

    await auditService.log({
      actorId: user.id,
      action: "auth.oauth_login_success",
      targetType: "user",
      targetId: user.id,
      metadata: {
        provider,
        ipAddress: metadata.ipAddress,
        deviceInfo: metadata.deviceInfo,
      },
    });

    return this.createAuthenticatedSession(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      metadata,
    );
  }

  /**
   * Create access token + refresh session.
   *
   * This is shared by:
   * - normal login
   * - Google OAuth login
   */
  private async createAuthenticatedSession(
    user: {
      id: string;
      email: string;
      username: string;
    },
    metadata: SessionMetadata,
  ) {
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

  /**
   * Logout.
   */
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

  /**
   * Refresh access token.
   */
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

  /**
   * Verify email using 6 digit code.
   */
  async verifyEmail(data: VerifyEmailInput) {
    const email = data.email.trim().toLowerCase();

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Email atau kode verifikasi tidak valid");
    }

    if (user.emailVerifiedAt) {
      return {
        emailVerified: true,
        message: "Email sudah diverifikasi",
      };
    }

    const tokenHash = this.hashAuthCode(data.code);

    const token = await authRepository.findValidAuthToken(tokenHash, "EMAIL_VERIFICATION");

    if (!token || token.userId !== user.id) {
      throw new UnauthorizedError("Kode verifikasi tidak valid atau sudah kedaluwarsa");
    }

    await authRepository.verifyUserEmail(user.id);

    await authRepository.markAuthTokenUsed(token.id);

    await authRepository.invalidateAuthTokens(user.id, "EMAIL_VERIFICATION");

    await auditService.log({
      actorId: user.id,
      action: "auth.email_verified",
      targetType: "user",
      targetId: user.id,
      metadata: {
        email: user.email,
      },
    });

    return {
      emailVerified: true,
      message: "Email berhasil diverifikasi",
    };
  }

  /**
   * Resend verification code.
   */
  async resendVerification(emailInput: string) {
    const email = emailInput.trim().toLowerCase();

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Email atau kode verifikasi tidak valid");
    }

    if (user.emailVerifiedAt) {
      throw new ConflictError("Email sudah diverifikasi");
    }

    await authRepository.invalidateAuthTokens(user.id, "EMAIL_VERIFICATION");

    const code = this.generateVerificationCode();

    await authRepository.createAuthToken({
      userId: user.id,
      type: "EMAIL_VERIFICATION",
      tokenHash: this.hashAuthCode(code),
      expiresAt: this.getAuthCodeExpiresAt(),
    });

    await sendEmail({
      to: user.email,
      subject: "Kode Verifikasi Baru - Aether",
      text: [
        `Kode verifikasi Aether kamu adalah ${code}.`,
        `Kode berlaku selama ${AUTH_CODE_EXPIRES_MINUTES} menit.`,
      ].join(" "),
      html: `
        <h2>Kode Verifikasi Baru</h2>

        <p>Kode verifikasi Aether kamu:</p>

        <h1>${code}</h1>

        <p>
          Kode berlaku selama
          ${AUTH_CODE_EXPIRES_MINUTES} menit.
        </p>
      `,
    });

    return {
      email: user.email,
      message: "Kode verifikasi baru telah dikirim",
    };
  }

  /**
   * Request password reset.
   */
  async forgotPassword(data: ForgotPasswordInput) {
    const email = data.email.trim().toLowerCase();

    const user = await authRepository.findUserByEmail(email);

    /**
     * Do not reveal whether email exists.
     */
    if (!user) {
      return {
        message: "Jika email terdaftar, kode reset password akan dikirim",
      };
    }

    /**
     * Google account does not have local password.
     */
    if (!user.passwordHash) {
      return {
        message: "Jika email terdaftar, instruksi pemulihan akan dikirim",
      };
    }

    await authRepository.invalidateAuthTokens(user.id, "PASSWORD_RESET");

    const code = this.generateVerificationCode();

    await authRepository.createAuthToken({
      userId: user.id,
      type: "PASSWORD_RESET",
      tokenHash: this.hashAuthCode(code),
      expiresAt: this.getAuthCodeExpiresAt(),
    });

    await sendEmail({
      to: user.email,
      subject: "Reset Password Aether",
      text: [
        `Kode reset password Aether kamu adalah ${code}.`,
        `Kode berlaku selama ${AUTH_CODE_EXPIRES_MINUTES} menit.`,
      ].join(" "),
      html: `
        <h2>Reset Password Aether</h2>

        <p>Kode reset password kamu:</p>

        <h1>${code}</h1>

        <p>
          Kode berlaku selama
          ${AUTH_CODE_EXPIRES_MINUTES} menit.
        </p>

        <p>
          Jika kamu tidak meminta reset password,
          abaikan email ini.
        </p>
      `,
    });

    return {
      message: "Jika email terdaftar, kode reset password akan dikirim",
    };
  }

  /**
   * Reset password using email + verification code.
   */
  async resetPassword(data: ResetPasswordInput) {
    const email = data.email.trim().toLowerCase();

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Kode reset password tidak valid atau sudah kedaluwarsa");
    }

    const token = await authRepository.findValidAuthToken(
      this.hashAuthCode(data.code),
      "PASSWORD_RESET",
    );

    if (!token || token.userId !== user.id) {
      throw new UnauthorizedError("Kode reset password tidak valid atau sudah kedaluwarsa");
    }

    const passwordHash = await hashPassword(data.password);

    await authRepository.updateUserPassword(user.id, passwordHash);

    await authRepository.markAuthTokenUsed(token.id);

    await authRepository.invalidateAuthTokens(user.id, "PASSWORD_RESET");

    /**
     * Password change invalidates all active sessions.
     */
    await prisma.session.updateMany({
      where: {
        userId: user.id,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    await auditService.log({
      actorId: user.id,
      action: "auth.password_reset",
      targetType: "user",
      targetId: user.id,
      metadata: {
        email: user.email,
      },
    });

    return {
      message: "Password berhasil diubah",
    };
  }
}

export const authService = new AuthService();
