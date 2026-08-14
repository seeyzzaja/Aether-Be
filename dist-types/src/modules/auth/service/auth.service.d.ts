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
    private generateRefreshToken;
    login(data: LoginInput, metadata: SessionMetadata): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
        };
        accessToken: string;
        refreshToken: string;
        csrfToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        csrfToken: string;
    }>;
    private hashRefreshToken;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth.service.d.ts.map