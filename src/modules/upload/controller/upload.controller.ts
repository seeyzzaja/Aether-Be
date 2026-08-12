import type { NextFunction, Request, Response } from "express";

import { uploadConfirmSchema, uploadSignatureSchema } from "#modules/upload/schema/upload.schema";
import { uploadService } from "#modules/upload/service/upload.service";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

export class UploadController {
  private getUserId(req: Request): string {
    if (!req.user) {
      throw new UnauthorizedError("User tidak ditemukan pada token");
    }

    return req.user.userId;
  }

  private getChannelId(req: Request): string {
    const { channelId } = req.params;

    if (typeof channelId !== "string" || !channelId) {
      throw new BadRequestError("Channel ID tidak valid");
    }

    return channelId;
  }

  async createSignature(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const channelId = this.getChannelId(req);

      const validatedData = uploadSignatureSchema.parse(req.body);

      const result = await uploadService.createSignature(userId, channelId, validatedData);

      return successResponse(res, "Upload signature berhasil dibuat", result);
    } catch (error) {
      next(error);
    }
  }
  async confirmUpload(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);

      const validatedData = uploadConfirmSchema.parse(req.body);

      const result = await uploadService.confirmUpload(userId, validatedData);

      return successResponse(res, "Upload berhasil dikonfirmasi", result, null, 201);
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
