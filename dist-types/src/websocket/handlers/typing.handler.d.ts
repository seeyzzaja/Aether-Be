import type { TypingPayload } from "#websocket/schemas/typing.schema";
import type { AuthenticatedSocket } from "#websocket/types/socket";
export declare function handleTypingStart(socket: AuthenticatedSocket, data: TypingPayload): void;
export declare function handleTypingStop(socket: AuthenticatedSocket, data: TypingPayload): void;
//# sourceMappingURL=typing.handler.d.ts.map