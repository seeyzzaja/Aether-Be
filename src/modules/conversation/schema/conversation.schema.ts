import { z } from "zod";

export const createDirectMessageSchema = z.object({
  userId: z.string().uuid("User ID tidak valid"),
});

export const createGroupConversationSchema = z
  .object({
    userIds: z
      .array(z.string().uuid("User ID tidak valid"))
      .min(2, "Minimal dua user diperlukan untuk Group DM"),
    name: z
      .string()
      .trim()
      .min(1, "Nama group DM tidak boleh kosong")
      .max(100, "Nama group DM maksimal 100 karakter")
      .optional(),
  })
  .refine(
    (data) => {
      const uniqueIds = new Set(data.userIds);

      return uniqueIds.size === data.userIds.length;
    },
    {
      message: "User ID tidak boleh duplicate",
      path: ["userIds"],
    },
  );

export const getConversationSchema = z.object({
  conversationId: z.string().uuid("Conversation ID tidak valid"),
});

export const updateGroupConversationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Nama group DM tidak boleh kosong")
      .max(100, "Nama group DM maksimal 100 karakter")
      .optional(),
    iconUrl: z
      .string()
      .trim()
      .url("Icon URL tidak valid")
      .max(2048, "Icon URL maksimal 2048 karakter")
      .nullable()
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.iconUrl !== undefined, {
    message: "Minimal name atau iconUrl harus diisi",
  });

export const groupParticipantSchema = z.object({
  userId: z.string().uuid("User ID tidak valid"),
});

export type CreateDirectMessageInput = z.infer<typeof createDirectMessageSchema>;
export type CreateGroupConversationInput = z.infer<typeof createGroupConversationSchema>;
export type UpdateGroupConversationInput = z.infer<typeof updateGroupConversationSchema>;
export type GroupParticipantInput = z.infer<typeof groupParticipantSchema>;
