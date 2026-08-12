import { z } from "zod";

const messageAttachmentSchema = z.object({
  fileUrl: z.string().url("File URL tidak valid"),
  thumbnailUrl: z.string().url("Thumbnail URL tidak valid").nullable().optional(),
  fileType: z.string().trim().min(1, "File type wajib diisi").max(50),
  fileSize: z.number().int().positive("File size harus lebih dari 0"),
  fileName: z.string().trim().min(1, "File name wajib diisi").max(255),
});

export const createMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Isi pesan wajib diisi")
    .max(4000, "Isi pesan maksimal 4000 karakter"),

  replyToId: z.string().uuid("Reply message ID tidak valid").nullable().optional(),

  threadRootId: z.string().uuid("Thread root message ID tidak valid").nullable().optional(),

  attachments: z.array(messageAttachmentSchema).max(10, "Maksimal 10 attachment").optional(),
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
