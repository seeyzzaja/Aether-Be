import type { NextFunction, Request, Response } from "express";

import { messageService } from "#modules/message/service/message.service";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

import { createMessageSchema, updateMessageSchema } from "../schema/message.schema.js";

export class MessageController {
  private getChannelId(req: Request): string {
    const { channelId } = req.params;

    if (typeof channelId !== "string" || !channelId) {
      throw new BadRequestError("Channel ID tidak valid");
    }

    return channelId;
  }

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

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const channelId = this.getChannelId(req);
      console.log("[MessageController.create] request received", {
        userId,
        channelId,
      });

      const validatedData = createMessageSchema.parse(req.body);
      console.log("[MessageController.create] payload validated");

      const message = await messageService.create(channelId, userId, validatedData);
      console.log("[MessageController.create] message created", {
        messageId: message.id,
      });

      return successResponse(res, "Pesan berhasil dikirim", message, null, 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const messageId = this.getMessageId(req);

      const validatedData = updateMessageSchema.parse(req.body);

      const message = await messageService.update(messageId, userId, validatedData);

      return successResponse(res, "Pesan berhasil diperbarui", message);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const messageId = this.getMessageId(req);

      await messageService.delete(messageId, userId);

      return successResponse(res, "Pesan berhasil dihapus");
    } catch (error) {
      next(error);
    }
  }
  async pin(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const messageId = this.getMessageId(req);

      const message = await messageService.pin(messageId, userId);

      return successResponse(res, "Pesan berhasil disematkan", message);
    } catch (error) {
      next(error);
    }
  }

  async unpin(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const messageId = this.getMessageId(req);

      const message = await messageService.unpin(messageId, userId);

      return successResponse(res, "Pesan berhasil dilepas dari sematan", message);
    } catch (error) {
      next(error);
    }
  }
}

export const messageController = new MessageController();
