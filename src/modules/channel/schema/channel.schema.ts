import { z } from "zod";

export const channelTypeSchema = z.enum(["TEXT", "VOICE", "VIDEO", "FORUM", "ANNOUNCEMENT"]);

export const createChannelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama channel wajib diisi")
    .max(100, "Nama channel maksimal 100 karakter"),

  type: channelTypeSchema,

  topic: z.string().trim().max(500, "Topik channel maksimal 500 karakter").optional(),

  categoryId: z.string().uuid("Category ID tidak valid").nullable().optional(),
});

export const updateChannelSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Nama channel tidak boleh kosong")
      .max(100, "Nama channel maksimal 100 karakter")
      .optional(),

    type: channelTypeSchema.optional(),

    topic: z.string().trim().max(500, "Topik channel maksimal 500 karakter").nullable().optional(),

    categoryId: z.string().uuid("Category ID tidak valid").nullable().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.type !== undefined ||
      data.topic !== undefined ||
      data.categoryId !== undefined,
    {
      message: "Minimal satu data harus diubah",
    },
  );

export type CreateChannelInput = z.infer<typeof createChannelSchema>;

export type UpdateChannelInput = z.infer<typeof updateChannelSchema>;
