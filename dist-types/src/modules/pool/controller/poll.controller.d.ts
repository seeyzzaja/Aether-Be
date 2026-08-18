import type { NextFunction, Request, Response } from "express";
export declare class PollController {
    private getUserId;
    private getParam;
    create(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    vote(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const pollController: PollController;
//# sourceMappingURL=poll.controller.d.ts.map