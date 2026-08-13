import type { TypingPayload } from "#websocket/schemas/typing.schema";
import { typingSchema } from "#websocket/schemas/typing.schema";

export function validateTyping(data: unknown): TypingPayload {
  return typingSchema.parse(data);
}
