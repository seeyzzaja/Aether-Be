import type { SubscribeSchema } from "#websocket/schemas/index.js";
import { subscribeSchema } from "#websocket/schemas/index.js";

export function validateSubscribe(data: unknown): SubscribeSchema {
  return subscribeSchema.parse(data);
}
