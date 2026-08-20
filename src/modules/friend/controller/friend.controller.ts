import type { NextFunction, Request, Response } from "express";

import {
  acceptFriendRequest,
  deleteFriendRequest,
  getFriends,
  removeFriend,
  sendFriendRequest,
} from "#modules/friend/service/friend.service";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

import {
  createFriendRequestSchema,
  friendListQuerySchema,
  friendRequestIdSchema,
  friendUserIdSchema,
} from "../schema/friend.schema.js";

export class FriendController {
  private getUserId(req: Request): string {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("User tidak ditemukan pada token");
    }

    return user.userId;
  }

  private getFriendshipId(req: Request): string {
    const parsed = friendRequestIdSchema.safeParse(req.params);

    if (!parsed.success) {
      throw new BadRequestError("Friendship ID tidak valid");
    }

    return parsed.data.id;
  }

  private getTargetUserId(req: Request): string {
    const parsed = friendUserIdSchema.safeParse(req.params);

    if (!parsed.success) {
      throw new BadRequestError("User ID tidak valid");
    }

    return parsed.data.userId;
  }

  async sendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getUserId(req);

      const parsed = createFriendRequestSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new BadRequestError("User ID tidak valid");
      }

      const friendship = await sendFriendRequest(actorId, parsed.data.userId);

      return successResponse(
        res,
        friendship.status === "ACCEPTED"
          ? "Permintaan pertemanan otomatis diterima"
          : "Permintaan pertemanan berhasil dikirim",
        friendship,
      );
    } catch (error) {
      next(error);
    }
  }

  async acceptRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getUserId(req);
      const friendshipId = this.getFriendshipId(req);

      const friendship = await acceptFriendRequest(actorId, friendshipId);

      return successResponse(res, "Permintaan pertemanan berhasil diterima", friendship);
    } catch (error) {
      next(error);
    }
  }

  async deleteRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getUserId(req);
      const friendshipId = this.getFriendshipId(req);

      await deleteFriendRequest(actorId, friendshipId);

      return successResponse(res, "Permintaan pertemanan berhasil dibatalkan", null);
    } catch (error) {
      next(error);
    }
  }

  async removeFriend(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getUserId(req);
      const targetUserId = this.getTargetUserId(req);

      await removeFriend(actorId, targetUserId);

      return successResponse(res, "Teman berhasil dihapus", null);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getUserId(req);

      const parsed = friendListQuerySchema.safeParse(req.query);

      if (!parsed.success) {
        throw new BadRequestError("Filter tab tidak valid");
      }

      const friends = await getFriends(actorId, parsed.data.tab);

      return successResponse(res, "Daftar teman berhasil diambil", friends);
    } catch (error) {
      next(error);
    }
  }
}

export const friendController = new FriendController();
