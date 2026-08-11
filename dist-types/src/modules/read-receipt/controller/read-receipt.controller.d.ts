import type { NextFunction, Request, Response } from "express";
export declare class ReadReceiptController {
    private getChannelId;
    private getUserId;
    update(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    get(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const readReceiptController: ReadReceiptController;
//# sourceMappingURL=read-receipt.controller.d.ts.map