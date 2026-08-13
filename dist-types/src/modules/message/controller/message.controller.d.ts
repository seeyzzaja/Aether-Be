import type { NextFunction, Request, Response } from "express";
export declare class MessageController {
    private getChannelId;
    private getMessageId;
    private getUserId;
    create(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    pin(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    unpin(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const messageController: MessageController;
//# sourceMappingURL=message.controller.d.ts.map