import type { LoginInput, RegisterInput } from "../auth.schema.js";
export declare class AuthService {
    register(data: RegisterInput): Promise<{
        id: string;
        email: string;
        username: string;
        createdAt: Date;
    }>;
    login(data: LoginInput): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map