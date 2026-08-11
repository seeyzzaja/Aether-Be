import { z } from "zod";

export const typingSchema = z.object({
  channelId: z.string().min(1),
});

export type TypingPayload = z.infer<typeof typingSchema>;
