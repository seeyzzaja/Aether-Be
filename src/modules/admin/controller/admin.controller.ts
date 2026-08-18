import type { NextFunction, Request, Response } from "express";

import {
  adminAuditLogQuerySchema,
  adminBulkKickMemberSchema,
  adminBulkMessageDeleteSchema,
  adminSuspendUserParamsSchema,
  adminUserListQuerySchema,
} from "#modules/admin/schema/admin.schema";
import { adminService } from "#modules/admin/service/admin.service";
import { UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

export class AdminController {
  private getActorId(req: Request): string {
    const user = (req as Request & { user?: { userId: string } }).user;

    if (!user) {
      throw new UnauthorizedError("User tidak ditemukan pada token");
    }

    return user.userId;
  }

  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getActorId(req);
      const query = adminUserListQuerySchema.parse(req.query);

      const result = await adminService.listUsers(actorId, {
        ...(query.q !== undefined && { q: query.q }),
        ...(query.email !== undefined && { email: query.email }),
        ...(query.username !== undefined && { username: query.username }),
        ...(query.suspended !== undefined && { suspended: query.suspended }),
        page: query.page,
        limit: query.limit,
      });
      const totalPages = Math.ceil(result.total / query.limit);

      return successResponse(res, "Daftar user berhasil diambil", result.users, {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  async suspendUser(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getActorId(req);
      const params = adminSuspendUserParamsSchema.parse(req.params);

      const user = await adminService.suspendUser(actorId, params.userId);

      return successResponse(res, "User berhasil disuspend", user);
    } catch (error) {
      next(error);
    }
  }

  async listAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getActorId(req);
      const query = adminAuditLogQuerySchema.parse(req.query);

      const result = await adminService.listAuditLogs(actorId, {
        ...(query.actorId !== undefined && { actorId: query.actorId }),
        ...(query.userId !== undefined && { targetId: query.userId }),
        ...(query.action !== undefined && { action: query.action }),
        ...(query.targetId !== undefined &&
          query.userId === undefined && { targetId: query.targetId }),
        ...(query.targetType !== undefined && { targetType: query.targetType }),
        ...(query.startTime !== undefined && { startTime: new Date(query.startTime) }),
        ...(query.endTime !== undefined && { endTime: new Date(query.endTime) }),
        page: query.page,
        limit: query.limit,
      });

      const totalPages = Math.ceil(result.total / query.limit);

      return successResponse(res, "Daftar audit log berhasil diambil", result.auditLogs, {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkDeleteMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getActorId(req);
      const payload = adminBulkMessageDeleteSchema.parse(req.body);

      const results = await adminService.bulkDeleteMessages(actorId, payload.messageIds);

      return successResponse(res, "Bulk delete pesan selesai", results);
    } catch (error) {
      next(error);
    }
  }

  async bulkKickMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = this.getActorId(req);
      const payload = adminBulkKickMemberSchema.parse(req.body);

      const results = await adminService.bulkKickMembers(actorId, payload.memberIds);

      return successResponse(res, "Bulk kick member selesai", results);
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
