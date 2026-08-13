import { z } from "zod";

export const createServerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama server wajib diisi")
    .max(100, "Nama server maksimal 100 karakter"),

  iconUrl: z
    .string()
    .trim()
    .url("Icon URL harus berupa URL yang valid")
    .max(500, "Icon URL maksimal 500 karakter")
    .optional(),
});

export const updateServerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Nama server wajib diisi")
      .max(100, "Nama server maksimal 100 karakter")
      .optional(),

    iconUrl: z
      .string()
      .trim()
      .url("Icon URL harus berupa URL yang valid")
      .max(500, "Icon URL maksimal 500 karakter")
      .nullable()
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.iconUrl !== undefined, {
    message: "Minimal satu data harus diubah",
  });

export type CreateServerInput = z.infer<typeof createServerSchema>;
export type UpdateServerInput = z.infer<typeof updateServerSchema>;
