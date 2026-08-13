import { z } from "zod";

export const createPollSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Pertanyaan poll wajib diisi")
    .max(255, "Pertanyaan poll maksimal 255 karakter"),

  options: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Opsi poll tidak boleh kosong")
        .max(255, "Opsi poll maksimal 255 karakter"),
    )
    .min(2, "Poll minimal memiliki 2 opsi")
    .max(20, "Poll maksimal memiliki 20 opsi"),

  allowMultipleChoice: z.boolean().default(false),

  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
});

export const submitVoteSchema = z.object({
  optionIds: z
    .array(z.string().uuid("Poll option ID tidak valid"))
    .min(1, "Minimal satu opsi harus dipilih")
    .max(20, "Maksimal 20 opsi dapat dipilih"),
});

export type CreatePollInput = z.infer<typeof createPollSchema>;
export type SubmitVoteInput = z.infer<typeof submitVoteSchema>;
