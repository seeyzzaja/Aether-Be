import type { NextFunction, Request, Response } from "express";
import { updateDmPrivacySchema, userIdParamSchema } from "#modules/user/schema/user.schema";
import {
  blockUser,
  getUserProfile,
  setDmPrivacy,
  unblockUser,
} from "#modules/user/service/user.service";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

export class UserController {
  private getUserId(req: Request): string {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("User tidak ditemukan pada token");
    }

    return user.userId;
  }

  private getTargetUserId(req: Request): string {
    const parsed = userIdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      throw new BadRequestError("User ID tidak valid");
    }

    return parsed.data.userId;
  }
  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getUserId(req);
      const targetUserId = this.getTargetUserId(req);

      const profile = await getUserProfile(actorId, targetUserId);

      return successResponse(res, "Profil user berhasil diambil", profile);
    } catch (error) {
      next(error);
    }
  }
  async block(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getUserId(req);
      const targetUserId = this.getTargetUserId(req);

      const blockedUser = await blockUser(actorId, targetUserId);

      return successResponse(res, "User berhasil diblokir", blockedUser);
    } catch (error) {
      next(error);
    }
  }

  async unblock(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getUserId(req);
      const targetUserId = this.getTargetUserId(req);

      await unblockUser(actorId, targetUserId);

      return successResponse(res, "User berhasil dibuka blokirnya", null);
    } catch (error) {
      next(error);
    }
  }

  async updatePrivacy(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getUserId(req);

      const parsed = updateDmPrivacySchema.safeParse(req.body);

      if (!parsed.success) {
        throw new BadRequestError("Pengaturan DM tidak valid");
      }

      const user = await setDmPrivacy(actorId, parsed.data.dmPrivacy);

      return successResponse(res, "Pengaturan privasi DM berhasil diperbarui", user);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
