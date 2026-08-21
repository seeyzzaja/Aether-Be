import type { NextFunction, Request, Response } from "express";
import {
  createMessageRequestSchema,
  messageRequestIdSchema,
} from "#modules/message-request/schema/message-request.schema";
import {
  acceptMessageRequest,
  createMessageRequest,
  getMessageRequestById,
  getPendingMessageRequests,
  rejectMessageRequest,
} from "#modules/message-request/service/message-request.service";
import { BadRequestError } from "#shared/errors/app-error";

function getUserId(req: Request): string {
  if (!req.user) {
    throw new BadRequestError("Pengguna belum terautentikasi");
  }

  return req.user.userId;
}

export class MessageRequestController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createMessageRequestSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new BadRequestError("Data message request tidak valid");
      }

      const actorId = getUserId(req);

      const result = await createMessageRequest(actorId, parsed.data.userId);

      return res.status(201).json({
        message: "Message request berhasil dikirim",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPending(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = getUserId(req);

      const result = await getPendingMessageRequests(actorId);

      return res.status(200).json({
        message: "Message requests berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = messageRequestIdSchema.safeParse(req.params);

      if (!parsed.success) {
        throw new BadRequestError("Message request ID tidak valid");
      }

      const actorId = getUserId(req);

      const result = await getMessageRequestById(actorId, parsed.data.requestId);

      return res.status(200).json({
        message: "Message request berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async accept(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = messageRequestIdSchema.safeParse(req.params);

      if (!parsed.success) {
        throw new BadRequestError("Message request ID tidak valid");
      }

      const actorId = getUserId(req);

      const result = await acceptMessageRequest(actorId, parsed.data.requestId);

      return res.status(200).json({
        message: "Message request berhasil diterima",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = messageRequestIdSchema.safeParse(req.params);

      if (!parsed.success) {
        throw new BadRequestError("Message request ID tidak valid");
      }

      const actorId = getUserId(req);

      const result = await rejectMessageRequest(actorId, parsed.data.requestId);

      return res.status(200).json({
        message: "Message request berhasil ditolak",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const messageRequestController = new MessageRequestController();
