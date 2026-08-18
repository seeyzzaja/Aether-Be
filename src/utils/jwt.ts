import jwt, { type SignOptions } from "jsonwebtoken";

import { config } from "#config/env";

type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;

export interface AccessTokenPayload {
  userId: string;
  email: string;
  username: string;
  sessionId: string;
}

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  const options: SignOptions = {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN as JwtExpiresIn,
  };

  return jwt.sign(payload, config.JWT_ACCESS_SECRET, options);
};
