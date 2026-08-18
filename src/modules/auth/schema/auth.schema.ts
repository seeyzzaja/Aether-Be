import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Format email tidak valid"),

  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter"),

  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),

  password: z.string().min(1, "Password wajib diisi"),
});

export const verifyEmailSchema = z.object({
  email: z.string().email("Format email tidak valid"),

  code: z.string().regex(/^\d{6}$/, "Kode verifikasi harus terdiri dari 6 digit"),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),

  code: z.string().regex(/^\d{6}$/, "Kode reset password harus terdiri dari 6 digit"),

  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
