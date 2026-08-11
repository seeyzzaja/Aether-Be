import { z } from "zod";
export declare const notificationListQuerySchema: z.ZodObject<{
    offset: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type NotificationListQuery = z.infer<typeof notificationListQuerySchema>;
//# sourceMappingURL=notification.schema.d.ts.map