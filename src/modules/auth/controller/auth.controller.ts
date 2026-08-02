import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  loginSchema,
  registerSchema,
} from "../auth.schema.js";
import { authService } from "#modules/auth/service/auth.service";

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validatedData =
        registerSchema.parse(req.body);

      const user =
        await authService.register(
          validatedData,
        );

      return res.status(201).json({
        success: true,
        message: "Registrasi berhasil",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validatedData =
        loginSchema.parse(req.body);

      const result =
        await authService.login(
          validatedData,
        );

      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController =
  new AuthController();
