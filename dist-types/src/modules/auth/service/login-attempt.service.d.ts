export declare class LoginAttemptService {
    isLocked(ipAddress: string | null, email: string): Promise<boolean>;
    recordFailure(ipAddress: string | null, email: string): Promise<{
        locked: boolean;
        attempts: number;
    }>;
    clearFailures(ipAddress: string | null, email: string): Promise<void>;
}
export declare const loginAttemptService: LoginAttemptService;
//# sourceMappingURL=login-attempt.service.d.ts.map