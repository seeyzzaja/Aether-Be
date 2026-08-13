import type { NextFunction, Request, Response } from "express";

import { getNotifications, markAsRead } from "#modules/notification/service/notification.service";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

import { notificationListQuerySchema } from "../schema/notification.schema.js";

export class NotificationController {
  private getNotificationId(req: Request): string {
    const { notificationId } = req.params;

    if (typeof notificationId !== "string" || !notificationId) {
      throw new BadRequestError("Notification ID tidak valid");
    }

    return notificationId;
  }

  private getUserId(req: Request): string {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("User tidak ditemukan pada token");
    }

    return user.userId;
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);

      const query = notificationListQuerySchema.parse(req.query);

      const result = await getNotifications(userId, query.offset, query.limit);

      const page = Math.floor(query.offset / query.limit) + 1;
      const totalPages = Math.ceil(result.total / query.limit);

      return successResponse(res, "Notifikasi berhasil diambil", result.notifications, {
        page,
        limit: query.limit,
        total: result.total,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const notificationId = this.getNotificationId(req);

      const notification = await markAsRead(notificationId, userId);

      return successResponse(
        res,
        "Notifikasi berhasil ditandai sebagai telah dibaca",
        notification,
      );
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
