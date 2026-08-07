import { z } from "zod";

export const subscribeSchema = z.object({
  channelId: z.string().min(1),
});

export type SubscribeSchema = z.infer<typeof subscribeSchema>;
