import type { NextFunction, Request, Response } from "express";
import { auditService } from "#modules/audit/service/audit.service";
import { logger } from "#shared/logger/logger";

type AuditLogOptions = {
  action: string;
  targetType: string;
  getTargetId: (req: Request, res: Response) => string;
  getMetadata?: (req: Request) => Record<string, unknown>;
};

type AuthenticatedRequest = Request & {
  user?: {
    userId?: string;
  };
};

export function auditLogMiddleware(options: AuditLogOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authenticatedRequest = req as AuthenticatedRequest;

    const actorId = authenticatedRequest.user?.userId ?? null;

    res.on("finish", () => {
      // Hanya catat aksi yang berhasil.
      if (res.statusCode < 200 || res.statusCode >= 400) {
        return;
      }

      let targetId: string;

      try {
        targetId = options.getTargetId(req, res);
      } catch (error) {
        logger.error(
          {
            error,
          },
          "[AuditLogMiddleware] Failed to resolve targetId",
        );
        return;
      }

      void auditService
        .log({
          actorId,
          action: options.action,
          targetType: options.targetType,
          targetId,
          metadata: {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            ...options.getMetadata?.(req),
          },
        })
        .catch((error: unknown) => {
          logger.error(
            {
              error,
            },
            "[AuditLogMiddleware] Failed to create audit log",
          );
        });
    });

    next();
  };
}
