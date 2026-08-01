import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "#config/env";
import { UnauthorizedError } from "#shared/errors/app-error";
import { authRepository } from "#modules/auth/auth.repository";
import type { JwtUserPayload } from "../types/express.js";

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = (req.cookies as Record<string, string> | undefined)?.accessToken;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : cookieToken;

    if (!token) {
      throw new UnauthorizedError("Akses ditolak. Token autentikasi tidak ditemukan");
    }

    let payload: JwtUserPayload;

    try {
      payload = jwt.verify(token, config.JWT_ACCESS_SECRET) as unknown as JwtUserPayload;
    } catch {
      throw new UnauthorizedError("Token tidak valid atau telah kedaluwarsa");
    }

    // Pastikan user masih ada & tidak di-suspend
    const user = await authRepository.findUserById(payload.userId);
    if (!user) {
      throw new UnauthorizedError("Pengguna tidak ditemukan");
    }

    if (user.isSuspended) {
      throw new UnauthorizedError("Akun Anda sedang ditangguhkan");
    }

    // Check session status if sessionId exists in token payload
    if (payload.sessionId) {
      const session = await authRepository.findSessionById(payload.sessionId);
      if (!session || session.revokedAt || new Date() > session.expiresAt) {
        throw new UnauthorizedError("Sesi Anda telah dicabut atau kedaluwarsa");
      }
    }

    req.user = {
      userId: user.id,
      email: user.email,
      username: user.username,
      sessionId: payload.sessionId,
      isPlatformAdmin: user.isPlatformAdmin,
    };

    next();
  } catch (error) {
    next(error);
  }
};
