import type { NextFunction, Request, Response } from "express";
export declare class MembershipController {
    private getServerId;
    join(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    leave(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    assignRole(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    removeRole(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getMyServers(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const membershipController: MembershipController;
//# sourceMappingURL=membership.controller.d.ts.map