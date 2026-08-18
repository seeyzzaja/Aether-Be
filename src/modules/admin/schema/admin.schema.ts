import { z } from "zod";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const adminUserListQuerySchema = paginationSchema.extend({
  q: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().email().optional(),
  username: z.string().trim().min(1).max(50).optional(),
  suspended: z.coerce.boolean().optional(),
});

export const adminAuditLogQuerySchema = paginationSchema.extend({
  actorId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  action: z.string().trim().min(1).max(100).optional(),
  targetId: z.string().trim().min(1).max(100).optional(),
  targetType: z.string().trim().min(1).max(50).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
});

export const adminSuspendUserParamsSchema = z.object({
  userId: z.string().uuid("User ID harus berupa UUID yang valid"),
});

export const adminBulkMessageDeleteSchema = z.object({
  messageIds: z.array(z.string().uuid("Message ID harus berupa UUID yang valid")).min(1),
});

export const adminBulkKickMemberSchema = z.object({
  memberIds: z.array(z.string().uuid("Member ID harus berupa UUID yang valid")).min(1),
});
