import type { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";
import { serializeBigInt } from "#utils/serialize-bigint";
import { createPollSchema, submitVoteSchema } from "../schema/poll.schema.js";
import { pollService } from "../service/poll.service.js";

export class PollController {
  private getUserId(req: Request): string {
    if (!req.user) {
      throw new UnauthorizedError("User tidak ditemukan pada token");
    }

    return req.user.userId;
  }

  private getParam(req: Request, key: string): string {
    const value = req.params[key];

    if (typeof value !== "string" || !value) {
      throw new BadRequestError(`${key} tidak valid`);
    }

    return value;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const messageId = this.getParam(req, "messageId");

      const input = createPollSchema.parse(req.body);

      const poll = await pollService.create(messageId, userId, input);

      return successResponse(res, "Poll berhasil dibuat", serializeBigInt(poll), null, 201);
    } catch (error) {
      next(error);
    }
  }

  async vote(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const pollId = this.getParam(req, "pollId");

      const input = submitVoteSchema.parse(req.body);

      const result = await pollService.vote(pollId, userId, input);

      return successResponse(res, "Vote berhasil disimpan", serializeBigInt(result));
    } catch (error) {
      next(error);
    }
  }
}

export const pollController = new PollController();
