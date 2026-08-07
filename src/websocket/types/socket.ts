import type WebSocket from "ws";

import type { AccessTokenPayload } from "#shared/auth/access-token.service.js";

export interface AuthenticatedSocket extends WebSocket {
  user: AccessTokenPayload;
}
