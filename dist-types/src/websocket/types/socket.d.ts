import type WebSocket from "ws";
import type { AccessTokenPayload } from "#shared/auth/access-token.service";
export interface AuthenticatedSocket extends WebSocket {
    user: AccessTokenPayload;
}
//# sourceMappingURL=socket.d.ts.map