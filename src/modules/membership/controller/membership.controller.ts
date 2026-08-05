import type { NextFunction, Request, Response } from "express";

import { membershipService } from "#modules/membership/service/membership.service.js";
import { UnauthorizedError } from "#shared/errors/app-error.js";
import { successResponse } from "#utils/response.js";

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
}

export const membershipController = new MembershipController();
