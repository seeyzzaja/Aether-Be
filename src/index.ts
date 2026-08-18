import app from "#app";
import { config } from "#config/env";
import { logger } from "#shared/logger/logger";
import { connectRedis } from "#shared/redis/redis.client";
import { startWebSocketServer } from "#websocket";

app.listen(config.PORT, "0.0.0.0", async () => {
  logger.info(`REST API → http://localhost:${config.PORT}`);

  await connectRedis();
  logger.info("Redis Publisher connected");

  await startWebSocketServer(config.WS_PORT);

  logger.info(`WebSocket → ws://localhost:${config.WS_PORT}`);
});
