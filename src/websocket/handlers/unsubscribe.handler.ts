import { WebSocketEvent } from "#websocket/constants/events";
import { connectionRegistry } from "#websocket/registry/index";
import type { UnsubscribeEventData } from "#websocket/types/events";
import type { WebSocketMessage } from "#websocket/types/message";
import type { AuthenticatedSocket } from "#websocket/types/socket";

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
