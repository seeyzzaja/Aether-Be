import { z } from "zod";
export declare const subscribeSchema: z.ZodObject<{
    channelId: z.ZodString;
}, z.core.$strip>;
export type SubscribeSchema = z.infer<typeof subscribeSchema>;
//# sourceMappingURL=subscribe.schema.d.ts.map