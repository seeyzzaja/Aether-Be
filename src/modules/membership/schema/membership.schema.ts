import { z } from "zod";

export const serverParamsSchema = z.object({
  serverId: z.uuid("Server ID harus berupa UUID yang valid"),
});

export type ServerParamsInput = z.infer<typeof serverParamsSchema>;
