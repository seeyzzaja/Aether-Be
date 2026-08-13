import { z } from "zod";
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
//# sourceMappingURL=category.schema.d.ts.map