import { z } from "zod";
export declare const upsertChannelPermissionOverrideSchema: z.ZodObject<{
    allowBitmask: z.ZodString;
    denyBitmask: z.ZodString;
}, z.core.$strip>;
export type UpsertChannelPermissionOverrideInput = z.infer<typeof upsertChannelPermissionOverrideSchema>;
//# sourceMappingURL=channel-permission-override.schema.d.ts.map