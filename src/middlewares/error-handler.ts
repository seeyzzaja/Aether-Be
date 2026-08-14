import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { config } from "#config/env";
import { AppError } from "#shared/errors/app-error";
import { logger } from "#shared/logger/logger";
import { errorResponse } from "#utils/response";

export const errorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode, err.errors, err.code ?? undefined);
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return errorResponse(res, "Validasi data gagal", 400, formattedErrors);
  }

  logger.error({ err }, "Unhandled Error");

  const stack = config.NODE_ENV === "development" ? err.stack : undefined;

  return errorResponse(res, "Terjadi kesalahan internal server", 500, stack ? { stack } : null);
};
