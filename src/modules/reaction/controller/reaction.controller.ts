import type { NextFunction, Request, Response } from "express";

import { reactionService } from "#modules/reaction/service/reaction.service";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

import { reactionSchema } from "../schema/reaction.schema.js";

export class ReactionController {
  private getMessageId(req: Request): string {
    const { messageId } = req.params;

    if (typeof messageId !== "string" || !messageId) {
      throw new BadRequestError("Message ID tidak valid");
    }

    return messageId;
  }

  private getUserId(req: Request): string {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("User tidak ditemukan pada token");
    }

    return user.userId;
  }

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const messageId = this.getMessageId(req);
      const userId = this.getUserId(req);
      const { emoji } = reactionSchema.parse(req.body);

      const reaction = await reactionService.add(messageId, userId, emoji);

      return successResponse(res, "Reaksi berhasil ditambahkan", reaction, null, 201);
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const messageId = this.getMessageId(req);
      const userId = this.getUserId(req);
      const { emoji } = reactionSchema.parse(req.body);

      await reactionService.remove(messageId, userId, emoji);

      return successResponse(res, "Reaksi berhasil dihapus");
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const messageId = this.getMessageId(req);

      const reactions = await reactionService.list(messageId);

      return successResponse(res, "Reaksi berhasil diambil", reactions);
    } catch (error) {
      next(error);
    }
  }
}

export const reactionController = new ReactionController();
