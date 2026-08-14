import { z } from "zod";
export declare const voiceTokenSchema: z.ZodObject<{
    withVideo: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type VoiceTokenInput = z.infer<typeof voiceTokenSchema>;
//# sourceMappingURL=voice.schema.d.ts.map