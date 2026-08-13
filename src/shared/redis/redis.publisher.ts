import { redisClient } from "#shared/redis/redis.client";
import type { RedisWebSocketEvent } from "#shared/redis/redis.types";
import { serializeBigInt } from "#utils/serialize-bigint";

export const REDIS_CHANNEL = "aether:websocket";

export async function publishWebSocketEvent(data: RedisWebSocketEvent): Promise<void> {
  await redisClient.publish(REDIS_CHANNEL, JSON.stringify(serializeBigInt(data)));
}
