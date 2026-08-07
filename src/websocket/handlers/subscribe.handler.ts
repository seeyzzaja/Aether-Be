import { WebSocketEvent } from "#websocket/constants/events.js";
import { connectionRegistry } from "#websocket/registry/index.js";
import type { SubscribeEventData } from "#websocket/types/events.js";
import type { WebSocketMessage } from "#websocket/types/message.js";
import type { AuthenticatedSocket } from "#websocket/types/socket.js";

export function handleSubscribe(
  socket: AuthenticatedSocket,
  message: WebSocketMessage<SubscribeEventData>,
): void {
  const { channelId } = message.data;
  connectionRegistry.subscribe(channelId, socket);
  connectionRegistry.dump();

  socket.send(
    JSON.stringify({
      event: WebSocketEvent.SUBSCRIBED,
      data: {
        channelId,
      },
    }),
  );

  console.log(`✅ ${socket.user.username} subscribed to ${channelId}`);
}
