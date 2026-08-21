import { z } from "zod";

export const createMessageRequestSchema = z.object({
  userId: z.string().uuid(),
});

export const messageRequestIdSchema = z.object({
  requestId: z.string().uuid(),
});

export type CreateMessageRequestInput = z.infer<typeof createMessageRequestSchema>;
