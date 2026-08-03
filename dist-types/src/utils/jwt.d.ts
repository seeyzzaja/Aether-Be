export interface AccessTokenPayload {
    userId: string;
    email: string;
    username: string;
    sessionId: string;
}
export interface RefreshTokenPayload {
    userId: string;
    sessionId: string;
}
export declare const generateAccessToken: (payload: AccessTokenPayload) => string;
export declare const generateRefreshToken: (payload: RefreshTokenPayload) => string;
//# sourceMappingURL=jwt.d.ts.map