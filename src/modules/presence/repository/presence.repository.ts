import { redisClient } from "#shared/redis/redis.client";

export const PRESENCE_KEY_PREFIX = "presence:user";

export const PRESENCE_STATUSES = ["online", "offline", "idle", "dnd", "invisible"] as const;

export type PresenceStatus = (typeof PRESENCE_STATUSES)[number];

type PresenceState = {
  status: PresenceStatus;
};

function getPresenceKey(userId: string): string {
  return `${PRESENCE_KEY_PREFIX}:${userId}`;
}
function getPresenceConnectionsKey(userId: string): string {
  return `presence:connections:${userId}`;
}

export async function incrementPresenceConnections(userId: string): Promise<number> {
  const key = getPresenceConnectionsKey(userId);

  return redisClient.incr(key);
}

export async function decrementPresenceConnections(userId: string): Promise<number> {
  const key = getPresenceConnectionsKey(userId);

  const connections = await redisClient.decr(key);

  if (connections <= 0) {
    await redisClient.del(key);
    return 0;
  }

  return connections;
}

export async function getPresenceConnections(userId: string): Promise<number> {
  const key = getPresenceConnectionsKey(userId);

  const value = await redisClient.get(key);

  return value ? Number(value) : 0;
}
export async function setPresence(userId: string, status: PresenceStatus): Promise<void> {
  const key = getPresenceKey(userId);

  const state: PresenceState = {
    status,
  };

  await redisClient.set(key, JSON.stringify(state));
}

export async function getPresence(userId: string): Promise<PresenceState | null> {
  const key = getPresenceKey(userId);

  const value = await redisClient.get(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as PresenceState;
}

export async function deletePresence(userId: string): Promise<void> {
  const key = getPresenceKey(userId);

  await redisClient.del(key);
}
