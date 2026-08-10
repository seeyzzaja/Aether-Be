import type { UnsubscribeSchema } from "#websocket/schemas/index";
import { unsubscribeSchema } from "#websocket/schemas/index";

export function validateUnsubscribe(data: unknown): UnsubscribeSchema {
  return unsubscribeSchema.parse(data);
}
