export interface AccessTokenPayload {
    userId: string;
    email: string;
    username: string;
    sessionId: string;
}
export declare const generateAccessToken: (payload: AccessTokenPayload) => string;
//# sourceMappingURL=jwt.d.ts.map