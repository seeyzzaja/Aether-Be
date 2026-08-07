import type { WebSocketEventType } from "#websocket/constants/events.js";

export interface WebSocketMessage<T = unknown> {
  event: WebSocketEventType;
  data: T;
}
