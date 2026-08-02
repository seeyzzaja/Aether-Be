import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { config } from "#config/env";
import { UnauthorizedError } from "#shared/errors/app-error";

interface AccessTokenPayload {
  userId: string;
  email: string;
  username: string;
  sessionId: string;
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token autentikasi tidak ditemukan");
    }

    const token = authHeader.substring(7);

    const payload = jwt.verify(token, config.JWT_ACCESS_SECRET) as AccessTokenPayload;

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
