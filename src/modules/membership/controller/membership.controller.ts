import type { NextFunction, Request, Response } from "express";

import { membershipService } from "#modules/membership/service/membership.service";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

import { serverParamsSchema } from "../schema/membership.schema.js";

export class MembershipController {
  private getServerId(req: Request): string {
    const validatedParams = serverParamsSchema.parse(req.params);

    return validatedParams.serverId;
  }

  async join(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      const serverId = this.getServerId(req);

      const member = await membershipService.join(serverId, user.userId);

      return successResponse(res, "Berhasil bergabung ke server", member, null, 201);
    } catch (error) {
      next(error);
    }
  }

  async leave(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      const serverId = this.getServerId(req);

      await membershipService.leave(serverId, user.userId);

      return successResponse(res, "Berhasil keluar dari server");
    } catch (error) {
      next(error);
    }
  }

  async assignRole(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      const { serverId, memberId, roleId } = req.params;

      if (
        !serverId ||
        !memberId ||
        !roleId ||
        Array.isArray(serverId) ||
        Array.isArray(memberId) ||
        Array.isArray(roleId)
      ) {
        throw new BadRequestError("Parameter tidak valid");
      }

      const result = await membershipService.assignRole(serverId, user.userId, memberId, roleId);

      return successResponse(res, "Role berhasil diberikan kepada member", result);
    } catch (error) {
      next(error);
    }
  }

  async removeRole(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      const { serverId, memberId, roleId } = req.params;

      if (
        !serverId ||
        !memberId ||
        !roleId ||
        Array.isArray(serverId) ||
        Array.isArray(memberId) ||
        Array.isArray(roleId)
      ) {
        throw new BadRequestError("Parameter tidak valid");
      }

      await membershipService.removeRole(serverId, user.userId, memberId, roleId);

      return successResponse(res, "Role berhasil dihapus dari member");
    } catch (error) {
      next(error);
    }
  }
  async getMyServers(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      const servers = await membershipService.getMyServers(user.userId);

      return successResponse(res, "Daftar server berhasil diambil", servers);
    } catch (error) {
      next(error);
    }
  }
}

export const membershipController = new MembershipController();
