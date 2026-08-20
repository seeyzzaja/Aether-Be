import type { RedisClientType } from "redis";
import { createClient } from "redis";

import { config } from "#config/env";
import { logger } from "#shared/logger/logger";
import { REDIS_CHANNEL } from "#shared/redis/redis.publisher";
import type { RedisWebSocketEvent } from "#shared/redis/redis.types";

export async function subscribeWebSocketEvents(
  onMessage: (message: RedisWebSocketEvent) => void,
): Promise<RedisClientType> {
  const subscriber = createClient({
    url: config.REDIS_URL,
  });

  subscriber.on("error", (error) => {
    logger.error(
      {
        err: error,
      },
      "Redis subscriber error",
    );
  });

  await subscriber.connect();

  await subscriber.subscribe(REDIS_CHANNEL, (message) => {
    try {
      const parsed: unknown = JSON.parse(message);

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("event" in parsed) ||
        !("data" in parsed)
      ) {
        logger.warn(
          {
            channel: REDIS_CHANNEL,
          },
          "Invalid Redis WebSocket event",
        );

        return;
      }

      onMessage(parsed as RedisWebSocketEvent);
    } catch (error) {
      logger.error(
        {
          err: error,
          channel: REDIS_CHANNEL,
        },
        "Failed to parse Redis WebSocket event",
      );
    }
  });

  logger.info(
    {
      channel: REDIS_CHANNEL,
    },
    "Redis subscriber connected",
  );

  return subscriber;
}
