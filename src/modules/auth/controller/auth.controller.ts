import type { Request, Response, NextFunction } from "express";
import { successResponse } from "#utils/response";
import { BadRequestError } from "#shared/errors/app-error";
import { authService } from "../sevice/auth.service.js";
import { loginSchema, registerSchema } from "../auth.schema.js";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await authService.register(validatedData);
      return successResponse(res, "Registrasi akun berhasil", user, null, 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const userAgent = req.headers["user-agent"];
      const rawIp = req.ip || (req.headers["x-forwarded-for"] as string | undefined);

      const meta: { deviceInfo?: string; ipAddress?: string } = {};
      if (userAgent) meta.deviceInfo = userAgent;
      if (rawIp) meta.ipAddress = rawIp;

      const result = await authService.login(validatedData, meta);

      // Simpan refresh token di HttpOnly Cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      });
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });

      return successResponse(
        res,
        "Login berhasil",
        {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        null,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken =
        (req.cookies as Record<string, string> | undefined)?.refreshToken ||
        (req.body as Record<string, string> | undefined)?.refreshToken;
      const result = await authService.refresh(refreshToken || "");
      return successResponse(res, "Token berhasil diperbarui", result, null, 200);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.sessionId && req.user?.userId) {
        await authService.logout(req.user.sessionId, req.user.userId);
      }
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return successResponse(res, "Logout berhasil", null, null, 200);
    } catch (error) {
      next(error);
    }
  }

  async getSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await authService.getSessions(req.user!.userId);
      return successResponse(
        res,
        "Daftar sesi aktif berhasil diambil",
        sessions,
        null,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async revokeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionIdParam = req.params.sessionId;
      const sessionId = Array.isArray(sessionIdParam)
        ? sessionIdParam[0]
        : sessionIdParam;
      if (!sessionId) {
        throw new BadRequestError("Session ID wajib disertakan");
      }
      await authService.revokeSession(sessionId, req.user!.userId);
      return successResponse(res, "Sesi berhasil dicabut", null, null, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
