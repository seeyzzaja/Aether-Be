import { z } from "zod";
export declare const createMessageSchema: z.ZodObject<{
    content: z.ZodString;
    replyToId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    threadRootId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        fileUrl: z.ZodString;
        thumbnailUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        fileType: z.ZodString;
        fileSize: z.ZodNumber;
        fileName: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updateMessageSchema: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strip>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
//# sourceMappingURL=message.schema.d.ts.map