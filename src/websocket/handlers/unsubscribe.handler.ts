import { WebSocketEvent } from "#websocket/constants/events.js";
import { connectionRegistry } from "#websocket/registry/index.js";
import type { UnsubscribeEventData } from "#websocket/types/events.js";
import type { WebSocketMessage } from "#websocket/types/message.js";
import type { AuthenticatedSocket } from "#websocket/types/socket.js";

export function handleUnsubscribe(
  socket: AuthenticatedSocket,
  message: WebSocketMessage<UnsubscribeEventData>,
): void {
  const { channelId } = message.data;

  connectionRegistry.unsubscribe(channelId, socket);
  connectionRegistry.dump();
  socket.send(
    JSON.stringify({
      event: WebSocketEvent.UNSUBSCRIBED,
      data: {
        channelId,
      },
    }),
  );

  console.log(`❌ ${socket.user.username} unsubscribed from ${channelId}`);
}
