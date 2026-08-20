import { messageService } from "#modules/message/service/message.service";
import { logger } from "#shared/logger/logger";
import { WebSocketEvent } from "#websocket/constants/events";
import { connectionRegistry } from "#websocket/registry/index";
import type { SubscribeEventData } from "#websocket/types/events";
import type { WebSocketMessage } from "#websocket/types/message";
import type { AuthenticatedSocket } from "#websocket/types/socket";

export async function handleSubscribe(
  socket: AuthenticatedSocket,
  message: WebSocketMessage<SubscribeEventData>,
): Promise<void> {
  const { channelId } = message.data;
  const userId = socket.user.userId;

  await messageService.authorizeChannelAccess(channelId, userId);

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

  logger.debug(
    {
      userId,
      channelId,
    },
    "WebSocket channel subscribed",
  );
}
