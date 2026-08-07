import jwt from "jsonwebtoken";

import { config } from "#config/env";
import { UnauthorizedError } from "#shared/errors/app-error";
import prisma from "#utils/prisma";

export interface AccessTokenPayload {
  userId: string;
  email: string;
  username: string;
  sessionId: string;
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  let payload: AccessTokenPayload;

  try {
    payload = jwt.verify(token, config.JWT_ACCESS_SECRET) as AccessTokenPayload;
  } catch {
    throw new UnauthorizedError("Token tidak valid atau telah kedaluwarsa");
  }

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

  return payload;
}
