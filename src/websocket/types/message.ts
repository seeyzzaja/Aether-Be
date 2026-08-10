import type { WebSocketEventType } from "#websocket/constants/events";

export interface WebSocketMessage<T = unknown> {
  event: WebSocketEventType;
  data: T;
}
