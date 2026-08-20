import { createClient } from "redis";

import { config } from "#config/env";
import { logger } from "#shared/logger/logger";

export const redisClient = createClient({
  url: config.REDIS_URL,
});

redisClient.on("error", (error) => {
  logger.error(
    {
      err: error,
    },
    "Redis client error",
  );
});

export async function connectRedis(): Promise<void> {
  if (redisClient.isOpen) {
    return;
  }

  await redisClient.connect();
}

export async function disconnectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    return;
  }

  await redisClient.quit();
}
