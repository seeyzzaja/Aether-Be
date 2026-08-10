import { connectionRegistry } from "#websocket/registry/index";

type RedisWebSocketEvent = {
  event: string;
  data: {
    channelId?: string;
  };
};

export function broadcastRedisEvent(event: RedisWebSocketEvent): void {
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
