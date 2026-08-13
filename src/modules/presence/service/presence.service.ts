import {
  getPresence,
  type PresenceStatus,
  setPresence,
} from "#modules/presence/repository/presence.repository";
import { publishWebSocketEvent } from "#shared/redis/redis.publisher";
export type PublicPresenceStatus = "online" | "offline" | "idle" | "dnd";

export function getPublicPresenceStatus(status: PresenceStatus): PublicPresenceStatus {
  if (status === "invisible") {
    return "offline";
  }

  return status;
}

export async function updatePresence(userId: string, status: PresenceStatus): Promise<void> {
  await setPresence(userId, status);

  const publicStatus = getPublicPresenceStatus(status);

  await publishWebSocketEvent({
    event: "presence.updated",
    data: {
      userId,
      status: publicStatus,
    },
  });
}

export async function getUserPresence(userId: string): Promise<PresenceStatus | null> {
  const presence = await getPresence(userId);

  return presence?.status ?? null;
}
