import { z } from "zod";
export declare const createServerSchema: z.ZodObject<{
    name: z.ZodString;
    iconUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateServerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    iconUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CreateServerInput = z.infer<typeof createServerSchema>;
export type UpdateServerInput = z.infer<typeof updateServerSchema>;
//# sourceMappingURL=server.schema.d.ts.map