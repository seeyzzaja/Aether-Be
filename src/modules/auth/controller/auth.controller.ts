import type { NextFunction, Request, Response } from "express";

import {
  CSRF_TOKEN_COOKIE,
  csrfTokenCookieOptions,
  REFRESH_TOKEN_COOKIE,
  refreshTokenCookieOptions,
} from "#modules/auth/auth-cookie";
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

      res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, refreshTokenCookieOptions);
      res.cookie(CSRF_TOKEN_COOKIE, result.csrfToken, csrfTokenCookieOptions);

      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

      if (!refreshToken) {
        throw new UnauthorizedError("Refresh token tidak ditemukan");
      }

      const result = await authService.refresh(refreshToken);

      res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, refreshTokenCookieOptions);
      res.cookie(CSRF_TOKEN_COOKIE, result.csrfToken, csrfTokenCookieOptions);

      return res.status(200).json({
        success: true,
        message: "Token berhasil diperbarui",
        data: {
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

      if (!refreshToken) {
        throw new UnauthorizedError("Refresh token tidak ditemukan");
      }

      await authService.logout(refreshToken);

      res.clearCookie(REFRESH_TOKEN_COOKIE, refreshTokenCookieOptions);

      return successResponse(res, "Logout berhasil", null, null, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
