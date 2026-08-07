export interface AccessTokenPayload {
    userId: string;
    email: string;
    username: string;
    sessionId: string;
}
export declare function verifyAccessToken(token: string): Promise<AccessTokenPayload>;
//# sourceMappingURL=access-token.service.d.ts.map