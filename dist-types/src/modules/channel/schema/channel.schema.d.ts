import { z } from "zod";
export declare const channelTypeSchema: z.ZodEnum<{
    ANNOUNCEMENT: "ANNOUNCEMENT";
    FORUM: "FORUM";
    TEXT: "TEXT";
    VIDEO: "VIDEO";
    VOICE: "VOICE";
}>;
export declare const createChannelSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        ANNOUNCEMENT: "ANNOUNCEMENT";
        FORUM: "FORUM";
        TEXT: "TEXT";
        VIDEO: "VIDEO";
        VOICE: "VOICE";
    }>;
    topic: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const updateChannelSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        ANNOUNCEMENT: "ANNOUNCEMENT";
        FORUM: "FORUM";
        TEXT: "TEXT";
        VIDEO: "VIDEO";
        VOICE: "VOICE";
    }>>;
    topic: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    categoryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CreateChannelInput = z.infer<typeof createChannelSchema>;
export type UpdateChannelInput = z.infer<typeof updateChannelSchema>;
//# sourceMappingURL=channel.schema.d.ts.map