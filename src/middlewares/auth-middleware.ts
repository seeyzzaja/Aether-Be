import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "#shared/auth/access-token.service.js";
import { UnauthorizedError } from "#shared/errors/app-error";

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token autentikasi tidak ditemukan");
    }

    const token = authHeader.substring(7);

    const payload = await verifyAccessToken(token);

    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
};
