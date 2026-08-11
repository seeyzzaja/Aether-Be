import { z } from "zod";
export declare const typingSchema: z.ZodObject<{
    channelId: z.ZodString;
}, z.core.$strip>;
export type TypingPayload = z.infer<typeof typingSchema>;
//# sourceMappingURL=typing.schema.d.ts.map