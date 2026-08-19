import type { NextFunction, Request, Response } from "express";
import {
  createDirectMessageSchema,
  createGroupConversationSchema,
  getConversationSchema,
} from "#modules/conversation/schema/conversation.schema";
import { conversationService } from "#modules/conversation/service/conversation.service";
import { UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

export class ConversationController {
  private getUserId(req: Request) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("User tidak ditemukan pada token");
    }

    return user.userId;
  }

  async createDirectMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const validated = createDirectMessageSchema.parse(req.body);

      const conversation = await conversationService.createDirectMessage(userId, validated);

      return successResponse(res, "Conversation DM berhasil dibuka", conversation, null, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);

      const conversations = await conversationService.getConversations(userId);

      return successResponse(res, "Daftar conversation berhasil diambil", conversations);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const validated = getConversationSchema.parse({
        conversationId: req.params.conversationId,
      });

      const conversation = await conversationService.getConversation(
        validated.conversationId,
        userId,
      );

      return successResponse(res, "Detail conversation berhasil diambil", conversation);
    } catch (error) {
      next(error);
    }
  }

  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const validated = createGroupConversationSchema.parse(req.body);

      const conversation = await conversationService.createGroupConversation(userId, validated);

      return successResponse(res, "Group conversation berhasil dibuat", conversation, null, 201);
    } catch (error) {
      next(error);
    }
  }
}

export const conversationController = new ConversationController();
