import type { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput, VerifyEmailInput } from "#modules/auth/schema/auth.schema";
type SessionMetadata = {
    deviceInfo: string | null;
    ipAddress: string | null;
};
export declare class AuthService {
    /**
     * Generate 6 digit verification code.
     */
    private generateVerificationCode;
    /**
     * Hash verification/reset code before storing it.
     */
    private hashAuthCode;
    /**
     * Verification/reset code expires after 10 minutes.
     */
    private getAuthCodeExpiresAt;
    /**
     * Register normal account.
     *
     * Flow:
     * 1. Check email.
     * 2. Check username.
     * 3. Hash password.
     * 4. Create user.
     * 5. Generate verification code.
     * 6. Store hashed code.
     * 7. Send verification email.
     */
    register(data: RegisterInput): Promise<{
        id: string;
        email: string;
        username: string;
        emailVerified: boolean;
        createdAt: Date;
    }>;
    /**
     * Login rate-limit key.
     */
    private getLoginKey;
    /**
     * Check whether login is currently locked.
     */
    private isLoginLocked;
    /**
     * Record failed login attempt.
     */
    private recordFailedLogin;
    /**
     * Generate random refresh token.
     */
    private generateRefreshToken;
    /**
     * Hash refresh token before storing it.
     */
    private hashRefreshToken;
    /**
     * Normal email/password login.
     */
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
    private getUniqueUsername;
    createOAuthLoginUrl(provider: "GOOGLE" | "GITHUB" | "FACEBOOK"): Promise<string>;
    handleOAuthCallback(provider: "GOOGLE" | "GITHUB" | "FACEBOOK", code: string, state: string, metadata: SessionMetadata): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
        };
        accessToken: string;
        refreshToken: string;
        csrfToken: string;
    }>;
    /**
     * Create access token + refresh session.
     *
     * This is shared by:
     * - normal login
     * - Google OAuth login
     */
    private createAuthenticatedSession;
    /**
     * Logout.
     */
    logout(refreshToken: string): Promise<void>;
    /**
     * Refresh access token.
     */
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        csrfToken: string;
    }>;
    /**
     * Verify email using 6 digit code.
     */
    verifyEmail(data: VerifyEmailInput): Promise<{
        emailVerified: boolean;
        message: string;
    }>;
    /**
     * Resend verification code.
     */
    resendVerification(emailInput: string): Promise<{
        email: string;
        message: string;
    }>;
    /**
     * Request password reset.
     */
    forgotPassword(data: ForgotPasswordInput): Promise<{
        message: string;
    }>;
    /**
     * Reset password using email + verification code.
     */
    resetPassword(data: ResetPasswordInput): Promise<{
        message: string;
    }>;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth.service.d.ts.map