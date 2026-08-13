import { z } from "zod";

export const upsertChannelPermissionOverrideSchema = z.object({
  allowBitmask: z.string().regex(/^\d+$/, "allowBitmask harus berupa angka"),
  denyBitmask: z.string().regex(/^\d+$/, "denyBitmask harus berupa angka"),
});

export type UpsertChannelPermissionOverrideInput = z.infer<
  typeof upsertChannelPermissionOverrideSchema
>;
