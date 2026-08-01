import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/app-error.js";
import { errorResponse } from "#utils/response";
import { config } from "#config/env";
import { ZodError } from "zod";

export const errorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode, err.errors);
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return errorResponse(res, "Validasi data gagal", 400, formattedErrors);
  }

  console.error("Unhandled Error:", err);
  const stack = config.NODE_ENV === "development" ? err.stack : undefined;
  return errorResponse(
    res,
    "Terjadi kesalahan internal server",
    500,
    stack ? { stack } : null
  );
};
