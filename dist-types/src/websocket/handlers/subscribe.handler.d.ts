import type { SubscribeEventData } from "#websocket/types/events";
import type { WebSocketMessage } from "#websocket/types/message";
import type { AuthenticatedSocket } from "#websocket/types/socket";
export declare function handleSubscribe(socket: AuthenticatedSocket, message: WebSocketMessage<SubscribeEventData>): Promise<void>;
//# sourceMappingURL=subscribe.handler.d.ts.map