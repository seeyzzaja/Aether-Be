import type { UnsubscribeSchema } from "#websocket/schemas/index.js";
import { unsubscribeSchema } from "#websocket/schemas/index.js";

export function validateUnsubscribe(data: unknown): UnsubscribeSchema {
  return unsubscribeSchema.parse(data);
}
