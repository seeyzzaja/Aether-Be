import { z } from "zod";

export const voiceTokenSchema = z.object({
  withVideo: z.boolean().default(false),
});

export type VoiceTokenInput = z.infer<typeof voiceTokenSchema>;
