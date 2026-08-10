import { WebSocketEvent } from "#websocket/constants/events";
import { connectionRegistry } from "#websocket/registry/index";
import type { SubscribeEventData } from "#websocket/types/events";
import type { WebSocketMessage } from "#websocket/types/message";
import type { AuthenticatedSocket } from "#websocket/types/socket";

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
