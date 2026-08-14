import { createHmac, timingSafeEqual } from "node:crypto";

import { config } from "#config/env";

const CSRF_SECRET = config.JWT_ACCESS_SECRET;

export function generateCsrfToken(sessionId: string) {
  return createHmac("sha256", CSRF_SECRET).update(sessionId).digest("hex");
}

export function verifyCsrfToken(sessionId: string, token: string) {
  const expectedToken = generateCsrfToken(sessionId);

  if (expectedToken.length !== token.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expectedToken, "hex"), Buffer.from(token, "hex"));
}
