import { z } from "zod";

export const messageSearchQuerySchema = z.object({
  q: z.string().trim().min(1).max(100),
  serverId: z.uuid().optional(),
  channelId: z.uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type MessageSearchQuery = z.infer<typeof messageSearchQuerySchema>;
