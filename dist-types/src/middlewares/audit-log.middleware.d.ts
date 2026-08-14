import type { NextFunction, Request, Response } from "express";
type AuditLogOptions = {
    action: string;
    targetType: string;
    getTargetId: (req: Request, res: Response) => string;
    getMetadata?: (req: Request) => Record<string, unknown>;
};
export declare function auditLogMiddleware(options: AuditLogOptions): (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=audit-log.middleware.d.ts.map