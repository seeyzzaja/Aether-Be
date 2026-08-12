import type { NextFunction, Request, Response } from "express";

import { searchService } from "#modules/search/service/search.service";
import { BadRequestError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

export class SearchController {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new BadRequestError("User ID tidak ditemukan");
      }

      const serverId = req.query.serverId;

      if (typeof serverId !== "string" || !serverId) {
        throw new BadRequestError("Server ID tidak valid");
      }

      const q = req.query.q;

      if (typeof q !== "string" || !q.trim()) {
        throw new BadRequestError("Query pencarian tidak valid");
      }

      const type = req.query.type;

      if (
        type !== undefined &&
        type !== "all" &&
        type !== "messages" &&
        type !== "servers" &&
        type !== "channels"
      ) {
        throw new BadRequestError("Tipe pencarian tidak valid");
      }

      const channelId = req.query.channelId;

      if (channelId !== undefined && typeof channelId !== "string") {
        throw new BadRequestError("Channel ID tidak valid");
      }

      const limit = typeof req.query.limit === "string" ? Number(req.query.limit) : 20;

      const offset = typeof req.query.offset === "string" ? Number(req.query.offset) : 0;

      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new BadRequestError("Limit tidak valid");
      }

      if (!Number.isInteger(offset) || offset < 0) {
        throw new BadRequestError("Offset tidak valid");
      }

      const result = await searchService.search(serverId, userId, {
        q: q.trim(),
        type: typeof type === "string" ? type : "all",
        ...(channelId !== undefined && {
          channelId,
        }),
        limit,
        offset,
      });

      return successResponse(res, "Pencarian berhasil", result);
    } catch (error) {
      next(error);
    }
  }
}

export const searchController = new SearchController();
