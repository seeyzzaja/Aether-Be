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
      console.warn(`Redis event ${event.event} tidak memiliki userId:`, event);
      return;
    }

    const sockets = connectionRegistry.getUserConnections(userId);

    console.log("===== REDIS USER BROADCAST =====");
    console.log("event:", event.event);
    console.log("userId:", userId);
    console.log("connections:", sockets.size);

    for (const socket of sockets) {
      if (socket.readyState === socket.OPEN) {
        socket.send(payload);
      }
    }

    console.log("================================");
    return;
  }

  // Event yang ditujukan kepada seluruh user di channel
  const channelId = event.data.channelId;

  if (!channelId) {
    console.warn("Redis event tidak memiliki channelId:", event);
    return;
  }

  const sockets = connectionRegistry.getConnections(channelId);

  console.log("===== REDIS CHANNEL BROADCAST =====");
  console.log("event:", event.event);
  console.log("channelId:", channelId);
  console.log("connections:", sockets.size);

  for (const socket of sockets) {
    if (socket.readyState === socket.OPEN) {
      socket.send(payload);
    }
  }

  console.log("===================================");
}
