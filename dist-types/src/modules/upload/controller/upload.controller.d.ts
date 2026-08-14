import type { NextFunction, Request, Response } from "express";
export declare class UploadController {
    private getUserId;
    private getChannelId;
    createSignature(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    confirmUpload(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const uploadController: UploadController;
//# sourceMappingURL=upload.controller.d.ts.map