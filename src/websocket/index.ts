import { subscribeWebSocketEvents } from "#shared/redis/redis.subscriber";
import { broadcastRedisEvent } from "#websocket/broadcast";
import { registerGateway } from "./gateway.js";
import { createWebSocketServer } from "./server.js";

export async function startWebSocketServer(port: number) {
  const wss = createWebSocketServer(port);

  registerGateway(wss);

  await subscribeWebSocketEvents((message) => {
    broadcastRedisEvent(message);
  });

  return wss;
}
