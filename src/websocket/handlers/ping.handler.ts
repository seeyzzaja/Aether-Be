import type WebSocket from "ws";
import { WebSocketEvent } from "#websocket/constants/events";
import type { WebSocketMessage } from "#websocket/types/message";

export function handlePing(socket: WebSocket, _message: WebSocketMessage): void {
  socket.send(
    JSON.stringify({
      event: WebSocketEvent.PONG,
      data: {
        timestamp: Date.now(),
      },
    }),
  );
}
