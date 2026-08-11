import type { NextFunction, Request, Response } from "express";

import { readReceiptService } from "#modules/read-receipt/service/read-receipt.service";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

import { updateReadReceiptSchema } from "../schema/read-receipt.schema.js";

export class ReadReceiptController {
  private getChannelId(req: Request): string {
    const { channelId } = req.params;

    if (typeof channelId !== "string" || !channelId) {
      throw new BadRequestError("Channel ID tidak valid");
    }

    return channelId;
  }

  private getUserId(req: Request): string {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("User tidak ditemukan pada token");
    }

    return user.userId;
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const channelId = this.getChannelId(req);
      const userId = this.getUserId(req);

      const validatedData = updateReadReceiptSchema.parse(req.body);

      const readState = await readReceiptService.update(channelId, userId, validatedData);

      return successResponse(res, "Read receipt berhasil diperbarui", readState);
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const channelId = this.getChannelId(req);
      const userId = this.getUserId(req);

      const readState = await readReceiptService.get(channelId, userId);

      return successResponse(res, "Read receipt berhasil diambil", readState);
    } catch (error) {
      next(error);
    }
  }
}

export const readReceiptController = new ReadReceiptController();
