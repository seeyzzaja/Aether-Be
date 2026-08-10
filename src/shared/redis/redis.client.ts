import { createClient } from "redis";

import { config } from "#config/env";

export const redisClient = createClient({
  url: config.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

export async function connectRedis(): Promise<void> {
  if (redisClient.isOpen) {
    return;
  }

  await redisClient.connect();
}
