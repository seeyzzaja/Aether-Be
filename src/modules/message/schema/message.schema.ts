import { z } from "zod";

export const createMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Isi pesan wajib diisi")
    .max(4000, "Isi pesan maksimal 4000 karakter"),

  replyToId: z.string().uuid("Reply message ID tidak valid").nullable().optional(),

  threadRootId: z.string().uuid("Thread root message ID tidak valid").nullable().optional(),
});

export const updateMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Isi pesan wajib diisi")
    .max(4000, "Isi pesan maksimal 4000 karakter"),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
