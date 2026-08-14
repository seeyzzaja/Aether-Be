import type { LoginInput, RegisterInput } from "../schema/auth.schema.js";
type SessionMetadata = {
    deviceInfo: string | null;
    ipAddress: string | null;
};
export declare class AuthService {
    register(data: RegisterInput): Promise<{
        id: string;
        email: string;
        username: string;
        createdAt: Date;
    }>;
    private getLoginKey;
    private isLoginLocked;
    private recordFailedLogin;
    login(data: LoginInput, metadata: SessionMetadata): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    logout(sessionId: string, userId: string): Promise<void>;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth.service.d.ts.map