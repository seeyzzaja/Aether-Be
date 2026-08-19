import { clearPresenceOfflineTimers } from "#modules/presence/service/presence.grace-period";
import { disconnectQueueConnection } from "#shared/queue/redis.connection";
import { subscribeWebSocketEvents } from "#shared/redis/redis.subscriber";
import { broadcastRedisEvent } from "#websocket/broadcast";
import { registerGateway } from "./gateway.js";
import { createWebSocketServer } from "./server.js";

export async function startWebSocketServer(port: number) {
  const wss = createWebSocketServer(port);

  registerGateway(wss);

  const subscriber = await subscribeWebSocketEvents((message) => {
    broadcastRedisEvent(message);
  });

  return {
    wss,
    close: async () => {
      clearPresenceOfflineTimers();

      await subscriber.quit();

      await disconnectQueueConnection();

      await new Promise<void>((resolve) => {
        wss.close(() => resolve());
      });
    },
  };
}
