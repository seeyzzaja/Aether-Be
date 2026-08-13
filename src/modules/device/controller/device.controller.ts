import type { NextFunction, Request, Response } from "express";

import { deviceService } from "#modules/device/service/device.service";
import { UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

export class DeviceController {
  async getActiveSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      const sessions = await deviceService.getActiveSessions(user.userId);

      return successResponse(res, "Daftar sesi aktif berhasil diambil", sessions, null, 200);
    } catch (error) {
      next(error);
    }
  }

  async revokeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const { sessionId } = req.params;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      if (typeof sessionId !== "string") {
        throw new UnauthorizedError("Session ID tidak valid");
      }

      await deviceService.revokeSession(sessionId, user.userId);

      return successResponse(res, "Sesi berhasil dicabut", null, null, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const deviceController = new DeviceController();
