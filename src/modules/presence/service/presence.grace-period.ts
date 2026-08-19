import { config } from "#config/env";
import { getPresenceConnections } from "#modules/presence/repository/presence.repository";
import { logger } from "#shared/logger/logger";
import { updatePresence } from "./presence.service.js";

const timers = new Map<string, NodeJS.Timeout>();

export function schedulePresenceOffline(userId: string): void {
  const existingTimer = timers.get(userId);

  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(async () => {
    timers.delete(userId);

    const connections = await getPresenceConnections(userId);

    logger.debug(
      {
        userId,
        connections,
      },
      "Presence grace period finished",
    );

    if (connections > 0) {
      logger.debug(
        {
          userId,
          connections,
        },
        "User reconnected during presence grace period",
      );

      return;
    }

    logger.debug(
      {
        userId,
      },
      "No global connections, setting user offline",
    );

    await updatePresence(userId, "offline");
  }, config.PRESENCE_GRACE_PERIOD_MS);

  timers.set(userId, timer);
}

export function cancelPresenceOffline(userId: string): void {
  const timer = timers.get(userId);

  if (!timer) {
    return;
  }

  clearTimeout(timer);
  timers.delete(userId);

  logger.debug(
    {
      userId,
    },
    "Presence offline timer cancelled",
  );
}

export function clearPresenceOfflineTimers(): void {
  for (const timer of timers.values()) {
    clearTimeout(timer);
  }

  timers.clear();

  logger.debug("All presence offline timers cleared");
}
