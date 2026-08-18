import { createHash } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { authRepository } from "#modules/auth/repository/auth.repository";
import { ForbiddenError } from "#shared/errors/app-error";
import { verifyCsrfToken } from "#utils/csrf";

function hashRefreshToken(refreshToken: string) {
  return createHash("sha256").update(refreshToken).digest("hex");
}

export const requireCsrf = (req: Request, _res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.refreshToken;
  const csrfToken = req.get("X-CSRF-Token");

  if (!refreshToken || !csrfToken) {
    return next(new ForbiddenError("CSRF protection: token tidak ditemukan"));
  }

  void (async () => {
    const session = await authRepository.findSessionByRefreshTokenHash(
      hashRefreshToken(refreshToken),
    );

    if (!session || session.revokedAt) {
      throw new ForbiddenError("CSRF protection: sesi tidak valid");
    }

    if (!verifyCsrfToken(session.id, csrfToken)) {
      throw new ForbiddenError("CSRF protection: token tidak valid");
    }
  })()
    .then(() => next())
    .catch(next);
};
