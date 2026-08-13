import { z } from "zod";
export declare const updateReadReceiptSchema: z.ZodObject<{
    messageId: z.ZodString;
}, z.core.$strip>;
export type UpdateReadReceiptInput = z.infer<typeof updateReadReceiptSchema>;
//# sourceMappingURL=read-receipt.schema.d.ts.map