import { z } from "zod";
export declare const createRoleSchema: z.ZodObject<{
    name: z.ZodString;
    permissions: z.ZodString;
}, z.core.$strip>;
export declare const updateRoleSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const assignRoleSchema: z.ZodObject<{
    memberId: z.ZodString;
    roleId: z.ZodString;
}, z.core.$strip>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
//# sourceMappingURL=role.schema.d.ts.map