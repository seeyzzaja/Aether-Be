import type { NextFunction, Request, Response } from "express";
export declare class AuthController {
    register(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    verifyEmail(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    resendVerification(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    oauthLogin(_req: Request, res: Response, next: NextFunction, provider: "GOOGLE" | "GITHUB" | "FACEBOOK"): Promise<void>;
    oauthCallback(req: Request, res: Response, next: NextFunction, provider: "GOOGLE" | "GITHUB" | "FACEBOOK"): Promise<void | Response<any, Record<string, any>>>;
    forgotPassword(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    refresh(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    logout(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const authController: AuthController;
//# sourceMappingURL=auth.controller.d.ts.map