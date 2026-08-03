import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { config } from "#config/env";
import { UnauthorizedError } from "#shared/errors/app-error";
import prisma from "#utils/prisma";

interface AccessTokenPayload {
  userId: string;
  email: string;
  username: string;
  sessionId: string;
}

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token autentikasi tidak ditemukan");
    }

    const token = authHeader.substring(7);

    const payload = jwt.verify(token, config.JWT_ACCESS_SECRET) as AccessTokenPayload;

    const session = await prisma.session.findUnique({
      where: {
        id: payload.sessionId,
      },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        revokedAt: true,
      },
    });

    if (!session) {
      throw new UnauthorizedError("Sesi tidak ditemukan");
    }

    if (session.userId !== payload.userId) {
      throw new UnauthorizedError("Sesi tidak sesuai dengan pengguna");
    }

    if (session.revokedAt !== null) {
      throw new UnauthorizedError("Sesi telah dicabut");
    }

    if (session.expiresAt <= new Date()) {
      throw new UnauthorizedError("Sesi telah kedaluwarsa");
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
      sessionId: payload.sessionId,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError("Token tidak valid atau telah kedaluwarsa"));
      return;
    }

    next(error);
  }
};
