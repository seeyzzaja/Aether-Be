import app from "#app";
import { config } from "#config/env";
import { connectRedis } from "#shared/redis/redis.client";
import { startWebSocketServer } from "#websocket";

app.listen(config.PORT, "0.0.0.0", async () => {
  console.log(`REST API → http://localhost:${config.PORT}`);

  await connectRedis();
  console.log("Redis Publisher connected");

  await startWebSocketServer(config.WS_PORT);

  console.log(`WebSocket → ws://localhost:${config.WS_PORT}`);
});
