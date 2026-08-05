import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama category wajib diisi")
    .max(100, "Nama category maksimal 100 karakter"),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama category tidak boleh kosong")
    .max(100, "Nama category maksimal 100 karakter"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
