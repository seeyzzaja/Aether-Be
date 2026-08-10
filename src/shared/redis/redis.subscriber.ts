import { createClient } from "redis";

import { config } from "#config/env";
import { REDIS_CHANNEL } from "#shared/redis/redis.publisher";
import type { RedisWebSocketEvent } from "#shared/redis/redis.types";

export async function subscribeWebSocketEvents(
  onMessage: (message: RedisWebSocketEvent) => void,
): Promise<void> {
  const subscriber = createClient({
    url: config.REDIS_URL,
  });

  subscriber.on("error", (error) => {
    console.error("Redis Subscriber Error:", error);
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
        console.error("Invalid Redis WebSocket event:", message);
        return;
      }

      onMessage(parsed as RedisWebSocketEvent);
    } catch (error) {
      console.error("Failed to parse Redis WebSocket event:", error);
    }
  });

  console.log(`Redis subscriber connected to ${REDIS_CHANNEL}`);
}
