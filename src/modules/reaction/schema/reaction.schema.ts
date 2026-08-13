import { z } from "zod";

export const reactionSchema = z.object({
  emoji: z.string().trim().min(1, "Emoji wajib diisi").max(32, "Emoji maksimal 32 karakter"),
});

export type ReactionInput = z.infer<typeof reactionSchema>;
