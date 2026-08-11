import type { NextFunction, Request, Response } from "express";
export declare class NotificationController {
    private getNotificationId;
    private getUserId;
    getAll(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    markAsRead(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const notificationController: NotificationController;
//# sourceMappingURL=notification.controller.d.ts.map