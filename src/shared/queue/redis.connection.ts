import { Redis } from "ioredis";
import { config } from "#config/env";

export const queueConnection = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export async function disconnectQueueConnection(): Promise<void> {
  if ((queueConnection.status as string) === "end") {
    return;
  }

  queueConnection.disconnect();

  await new Promise<void>((resolve) => {
    queueConnection.once("end", resolve);
  });
}
