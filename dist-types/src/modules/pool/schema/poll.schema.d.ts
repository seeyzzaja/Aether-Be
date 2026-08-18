import { z } from "zod";
export declare const createPollSchema: z.ZodObject<{
    question: z.ZodString;
    options: z.ZodArray<z.ZodString>;
    allowMultipleChoice: z.ZodDefault<z.ZodBoolean>;
    expiresAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const submitVoteSchema: z.ZodObject<{
    optionIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type CreatePollInput = z.infer<typeof createPollSchema>;
export type SubmitVoteInput = z.infer<typeof submitVoteSchema>;
//# sourceMappingURL=poll.schema.d.ts.map