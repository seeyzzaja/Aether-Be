import type { NextFunction, Request, Response } from "express";

import { serverService } from "#modules/server/service/server.service";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

import { createServerSchema, updateServerSchema } from "../schema/server.schema.js";

export class ServerController {
  private getServerId(req: Request): string {
    const { serverId } = req.params;

    if (typeof serverId !== "string" || !serverId) {
      throw new BadRequestError("Server ID tidak valid");
    }

    return serverId;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      const validatedData = createServerSchema.parse(req.body);

      const server = await serverService.create(user.userId, validatedData);

      return successResponse(res, "Server berhasil dibuat", server, null, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      const servers = await serverService.getAllByOwnerId(user.userId);

      return successResponse(res, "Daftar server berhasil diambil", servers);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const serverId = this.getServerId(req);

      const server = await serverService.getById(serverId);

      return successResponse(res, "Detail server berhasil diambil", server);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      const serverId = this.getServerId(req);
      const validatedData = updateServerSchema.parse(req.body);

      const server = await serverService.update(serverId, user.userId, validatedData);

      return successResponse(res, "Server berhasil diperbarui", server);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      const serverId = this.getServerId(req);

      await serverService.delete(serverId, user.userId);

      return successResponse(res, "Server berhasil dihapus");
    } catch (error) {
      next(error);
    }
  }
}

export const serverController = new ServerController();
