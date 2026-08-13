import { z } from "zod";

export const updateReadReceiptSchema = z.object({
  messageId: z.string().uuid("Message ID tidak valid"),
});

export type UpdateReadReceiptInput = z.infer<typeof updateReadReceiptSchema>;
