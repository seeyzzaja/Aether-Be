import type { NextFunction, Request, Response } from "express";

import { config } from "#config/env";
import {
  CSRF_TOKEN_COOKIE,
  csrfTokenCookieOptions,
  REFRESH_TOKEN_COOKIE,
  refreshTokenCookieOptions,
} from "#modules/auth/auth-cookie";
import { authService } from "#modules/auth/service/auth.service";
import { UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../schema/auth.schema.js";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);

      const user = await authService.register(validatedData);

      return res.status(201).json({
        success: true,
        message: "Registrasi berhasil. Silakan cek email untuk kode verifikasi.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = verifyEmailSchema.parse(req.body);

      const result = await authService.verifyEmail(validatedData);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          emailVerified: result.emailVerified,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = resendVerificationSchema.parse(req.body);

      const result = await authService.resendVerification(validatedData.email);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          email: result.email,
        },
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

  async oauthLogin(
    _req: Request,
    res: Response,
    next: NextFunction,
    provider: "GOOGLE" | "GITHUB" | "FACEBOOK",
  ) {
    try {
      const url = await authService.createOAuthLoginUrl(provider);
      return res.redirect(url);
    } catch (error) {
      next(error);
    }
  }

  async oauthCallback(
    req: Request,
    res: Response,
    next: NextFunction,
    provider: "GOOGLE" | "GITHUB" | "FACEBOOK",
  ) {
    try {
      const code = typeof req.query.code === "string" ? req.query.code : "";
      const state = typeof req.query.state === "string" ? req.query.state : "";

      const result = await authService.handleOAuthCallback(provider, code, state, {
        deviceInfo: req.get("user-agent") ?? null,
        ipAddress: req.ip ?? null,
      });

      res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, refreshTokenCookieOptions);

      res.cookie(CSRF_TOKEN_COOKIE, result.csrfToken, csrfTokenCookieOptions);

      if (config.OAUTH_SUCCESS_REDIRECT_URL) {
        return res.redirect(config.OAUTH_SUCCESS_REDIRECT_URL);
      }

      return res.status(200).json({
        success: true,
        message: "Login OAuth berhasil",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      if (config.OAUTH_FAILURE_REDIRECT_URL) {
        return res.redirect(config.OAUTH_FAILURE_REDIRECT_URL);
      }

      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);

      const result = await authService.forgotPassword(validatedData);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          message: result.message,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);

      const result = await authService.resetPassword(validatedData);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          message: result.message,
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

      res.clearCookie(CSRF_TOKEN_COOKIE, csrfTokenCookieOptions);

      return successResponse(res, "Logout berhasil", null, null, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
