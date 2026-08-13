import { config } from "#config/env";
import { getPresenceConnections } from "#modules/presence/repository/presence.repository";
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

    console.log("[PRESENCE] Grace period finished");
    console.log("[PRESENCE] Global connections:", connections);

    if (connections > 0) {
      console.log("[PRESENCE] User reconnected, staying online");
      return;
    }

    console.log("[PRESENCE] No global connections, setting offline");

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

  console.log("[PRESENCE] Offline timer cancelled:", userId);
}
