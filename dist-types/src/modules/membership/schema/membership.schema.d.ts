import { z } from "zod";
export declare const serverParamsSchema: z.ZodObject<{
    serverId: z.ZodUUID;
}, z.core.$strip>;
export type ServerParamsInput = z.infer<typeof serverParamsSchema>;
//# sourceMappingURL=membership.schema.d.ts.map