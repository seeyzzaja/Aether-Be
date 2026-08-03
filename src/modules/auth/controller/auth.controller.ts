import type { NextFunction, Request, Response } from "express";

import { authService } from "#modules/auth/service/auth.service";
import { UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

import { loginSchema, registerSchema } from "../schema/auth.schema.js";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);

      const user = await authService.register(validatedData);

      return res.status(201).json({
        success: true,
        message: "Registrasi berhasil",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);

      const result = await authService.login(validatedData, {
        deviceInfo: req.get("user-agent") ?? null,
        ipAddress: req.ip ?? null,
      });

      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user?.sessionId) {
        throw new UnauthorizedError("Session ID tidak ditemukan pada token");
      }

      await authService.logout(user.sessionId, user.userId);

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return successResponse(res, "Logout berhasil", null, null, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
