import { logger } from "#shared/logger/logger";
import { connectionRegistry } from "#websocket/registry/index";

type RedisWebSocketEvent = {
  event: string;
  data: {
    channelId?: string;
    userId?: string;
    [key: string]: unknown;
  };
};

export function broadcastRedisEvent(event: RedisWebSocketEvent): void {
  const payload = JSON.stringify({
    event: event.event,
    data: event.data,
  });

  // Event yang ditujukan langsung kepada user tertentu
  if (event.event === "presence.updated" || event.event === "notification.created") {
    const userId = event.data.userId;

    if (!userId) {
      logger.warn(
        {
          event: event.event,
        },
        "Redis user event does not contain userId",
      );

      return;
    }

    const sockets = connectionRegistry.getUserConnections(userId);

    logger.debug(
      {
        event: event.event,
        userId,
        connections: sockets.size,
      },
      "Broadcasting Redis event to user",
    );

    for (const socket of sockets) {
      if (socket.readyState === socket.OPEN) {
        socket.send(payload);
      }
    }

    return;
  }

  // Event yang ditujukan kepada seluruh user di channel
  const channelId = event.data.channelId;

  if (!channelId) {
    logger.warn(
      {
        event: event.event,
      },
      "Redis channel event does not contain channelId",
    );

    return;
  }

  const sockets = connectionRegistry.getConnections(channelId);

  logger.debug(
    {
      event: event.event,
      channelId,
      connections: sockets.size,
    },
    "Broadcasting Redis event to channel",
  );

  for (const socket of sockets) {
    if (socket.readyState === socket.OPEN) {
      socket.send(payload);
    }
  }
}
