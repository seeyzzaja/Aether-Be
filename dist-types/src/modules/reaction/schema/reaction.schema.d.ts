import { z } from "zod";
export declare const reactionSchema: z.ZodObject<{
    emoji: z.ZodString;
}, z.core.$strip>;
export type ReactionInput = z.infer<typeof reactionSchema>;
//# sourceMappingURL=reaction.schema.d.ts.map