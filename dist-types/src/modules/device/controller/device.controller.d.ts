import type { NextFunction, Request, Response } from "express";
export declare class DeviceController {
    getActiveSessions(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    revokeSession(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const deviceController: DeviceController;
//# sourceMappingURL=device.controller.d.ts.map