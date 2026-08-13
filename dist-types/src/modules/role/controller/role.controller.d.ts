import type { Request, Response } from "express";
export declare class RoleController {
    create(req: Request, res: Response, next: (error?: unknown) => void): Promise<Response<any, Record<string, any>> | undefined>;
    findAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response, next: (error?: unknown) => void): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=role.controller.d.ts.map