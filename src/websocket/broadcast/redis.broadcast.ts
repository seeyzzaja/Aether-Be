import { connectionRegistry } from "#websocket/registry/index";

type RedisWebSocketEvent = {
  event: string;
  data: {
    channelId?: string;
    userId?: string;
    status?: string;
  };
};

export function broadcastRedisEvent(event: RedisWebSocketEvent): void {
  if (event.event === "presence.updated") {
    const userId = event.data.userId;

    if (!userId) {
      console.warn("Presence event tidak memiliki userId:", event);
      return;
    }

    const sockets = connectionRegistry.getUserConnections(userId);

    const payload = JSON.stringify({
      event: event.event,
      data: event.data,
    });

    console.log("===== REDIS PRESENCE BROADCAST =====");
    console.log("event:", event.event);
    console.log("userId:", userId);
    console.log("connections:", sockets.size);

    for (const socket of sockets) {
      if (socket.readyState === socket.OPEN) {
        socket.send(payload);
      }
    }

    console.log("====================================");
    return;
  }

  const channelId = event.data.channelId;

  if (!channelId) {
    console.warn("Redis event tidak memiliki channelId:", event);
    return;
  }

  const sockets = connectionRegistry.getConnections(channelId);

  const payload = JSON.stringify({
    event: event.event,
    data: event.data,
  });

  console.log("===== REDIS BROADCAST =====");
  console.log("event:", event.event);
  console.log("channelId:", channelId);
  console.log("connections:", sockets.size);

  for (const socket of sockets) {
    if (socket.readyState === socket.OPEN) {
      socket.send(payload);
    }
  }

  console.log("===========================");
}
