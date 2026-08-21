import { z } from "zod";

export const userIdParamSchema = z.object({
  userId: z.string().uuid(),
});

export const updateDmPrivacySchema = z.object({
  dmPrivacy: z.enum(["EVERYONE", "FRIENDS_ONLY"]),
});

export type UpdateDmPrivacyInput = z.infer<typeof updateDmPrivacySchema>;
