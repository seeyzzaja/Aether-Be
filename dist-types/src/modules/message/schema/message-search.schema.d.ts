import { z } from "zod";
export declare const messageSearchQuerySchema: z.ZodObject<{
    q: z.ZodString;
    serverId: z.ZodOptional<z.ZodUUID>;
    channelId: z.ZodOptional<z.ZodUUID>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    offset: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type MessageSearchQuery = z.infer<typeof messageSearchQuerySchema>;
//# sourceMappingURL=message-search.schema.d.ts.map