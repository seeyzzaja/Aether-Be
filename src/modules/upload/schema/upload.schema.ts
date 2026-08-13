import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 1024;

const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
] as const;

export const uploadSignatureSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(1, "Nama file wajib diisi")
    .max(255, "Nama file maksimal 255 karakter"),

  fileType: z
    .string()
    .trim()
    .refine(
      (value) => (SUPPORTED_MIME_TYPES as readonly string[]).includes(value),
      "Tipe file tidak didukung",
    ),

  fileSize: z
    .number()
    .int("Ukuran file harus berupa bilangan bulat")
    .positive("Ukuran file harus lebih besar dari 0")
    .max(MAX_FILE_SIZE, "Ukuran file maksimal 1GB"),
});

export type UploadSignatureInput = z.infer<typeof uploadSignatureSchema>;
export const uploadConfirmSchema = z.object({
  channelId: z.string().uuid("Channel ID tidak valid"),

  publicId: z.string().trim().min(1, "Public ID wajib diisi").max(500, "Public ID tidak valid"),

  secureUrl: z.string().url("Secure URL tidak valid").max(500, "Secure URL terlalu panjang"),

  fileName: z
    .string()
    .trim()
    .min(1, "Nama file wajib diisi")
    .max(255, "Nama file maksimal 255 karakter"),

  fileType: z
    .string()
    .trim()
    .refine(
      (value) => (SUPPORTED_MIME_TYPES as readonly string[]).includes(value),
      "Tipe file tidak didukung",
    ),

  fileSize: z
    .number()
    .int("Ukuran file harus berupa bilangan bulat")
    .positive("Ukuran file harus lebih besar dari 0")
    .max(MAX_FILE_SIZE, "Ukuran file maksimal 1GB"),

  resourceType: z.string().trim().min(1).max(50),

  format: z.string().trim().min(1).max(50),
});

export type UploadConfirmInput = z.infer<typeof uploadConfirmSchema>;
export { MAX_FILE_SIZE, SUPPORTED_MIME_TYPES };
