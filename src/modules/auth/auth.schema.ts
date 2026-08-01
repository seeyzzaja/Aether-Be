import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(32, "Username maksimal 32 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh berupa huruf, angka, dan underscore"),
  password: z.string().min(8, "Password minimal 8 karakter").max(100, "Password terlalu panjang"),
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email atau username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const revokeSessionSchema = z.object({
  sessionId: z.string().uuid("Session ID tidak valid"),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
