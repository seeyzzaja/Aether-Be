import type { IncomingMessage } from "node:http";
import type { AuthenticatedSocket } from "#websocket/types/socket";
export declare function authenticateSocket(socket: AuthenticatedSocket, request: IncomingMessage): Promise<boolean>;
//# sourceMappingURL=auth.middleware.d.ts.map