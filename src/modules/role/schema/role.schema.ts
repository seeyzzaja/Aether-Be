import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, "Nama role wajib diisi").max(50, "Nama role maksimal 50 karakter"),

  permissions: z.string().regex(/^\d+$/, "Permission harus berupa angka bigint"),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1).max(50).optional(),

  permissions: z.string().regex(/^\d+$/).optional(),
});

export const assignRoleSchema = z.object({
  memberId: z.string().uuid(),

  roleId: z.string().uuid(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
