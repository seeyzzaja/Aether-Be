import type { NextFunction, Request, Response } from "express";
type RateLimitOptions = {
    windowSeconds: number;
    maxRequests: number;
    keyPrefix?: string;
    keyGenerator?: (req: Request) => string;
};
export declare function rateLimit(options: RateLimitOptions): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=rate-limit.middleware.d.ts.map