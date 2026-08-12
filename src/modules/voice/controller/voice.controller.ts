import type { NextFunction, Request, Response } from "express";
import { voiceTokenSchema } from "#modules/voice/schema/voice.schema";
import { voiceService } from "#modules/voice/service/voice.service";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

export class VoiceController {
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

  async createToken(req: Request, res: Response, next: NextFunction) {
    try {
      const channelId = this.getChannelId(req);
      const userId = this.getUserId(req);

      const validatedData = voiceTokenSchema.parse(req.body);

      const result = await voiceService.createVoiceToken(
        channelId,
        userId,
        validatedData.withVideo,
      );

      return successResponse(res, "Token LiveKit berhasil diterbitkan", result);
    } catch (error) {
      next(error);
    }
  }
}

export const voiceController = new VoiceController();
