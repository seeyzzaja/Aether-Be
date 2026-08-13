import type { SubscribeSchema } from "#websocket/schemas/index";
import { subscribeSchema } from "#websocket/schemas/index";

export function validateSubscribe(data: unknown): SubscribeSchema {
  return subscribeSchema.parse(data);
}
