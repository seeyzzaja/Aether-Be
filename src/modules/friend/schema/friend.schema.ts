import { z } from "zod";

export const createFriendRequestSchema = z.object({
  userId: z.string().uuid("User ID tidak valid"),
});

export const friendRequestIdSchema = z.object({
  id: z.string().uuid("Friendship ID tidak valid"),
});

export const friendUserIdSchema = z.object({
  userId: z.string().uuid("User ID tidak valid"),
});

export const friendListQuerySchema = z.object({
  tab: z.enum(["online", "all", "pending", "blocked"]).default("all"),
});

export type CreateFriendRequestInput = z.infer<typeof createFriendRequestSchema>;
export type FriendRequestIdInput = z.infer<typeof friendRequestIdSchema>;
export type FriendUserIdInput = z.infer<typeof friendUserIdSchema>;
export type FriendListQuery = z.infer<typeof friendListQuerySchema>;
