import { redisClient } from "#shared/redis/redis.client";

const CONNECTION_KEY_PREFIX = "presence:connections:";

function getConnectionKey(userId: string): string {
  return `${CONNECTION_KEY_PREFIX}${userId}`;
}

export async function incrementUserConnections(userId: string): Promise<number> {
  const key = getConnectionKey(userId);

  return redisClient.incr(key);
}

export async function decrementUserConnections(userId: string): Promise<number> {
  const key = getConnectionKey(userId);

  const count = await redisClient.decr(key);

  if (count <= 0) {
    await redisClient.del(key);
    return 0;
  }

  return count;
}

export async function getUserConnections(userId: string): Promise<number> {
  const key = getConnectionKey(userId);

  const value = await redisClient.get(key);

  if (!value) {
    return 0;
  }

  return Number(value);
}
