import { z } from "zod";

export const unsubscribeSchema = z.object({
  channelId: z.string().min(1),
});

export type UnsubscribeSchema = z.infer<typeof unsubscribeSchema>;
