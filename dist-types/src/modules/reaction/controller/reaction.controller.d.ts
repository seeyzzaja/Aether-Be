import type { NextFunction, Request, Response } from "express";
export declare class ReactionController {
    private getMessageId;
    private getUserId;
    add(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    remove(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    list(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const reactionController: ReactionController;
//# sourceMappingURL=reaction.controller.d.ts.map