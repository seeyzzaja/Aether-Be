export type OAuthProviderName = "GOOGLE" | "GITHUB" | "FACEBOOK";
export type OAuthStatePayload = {
    provider: OAuthProviderName;
    createdAt: number;
};
export type OAuthIdentity = {
    provider: OAuthProviderName;
    providerAccountId: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    usernameSeed: string;
};
export declare function createOAuthStatePayload(provider: OAuthProviderName): {
    provider: OAuthProviderName;
    createdAt: number;
};
export declare function createOAuthStateToken(): string;
export declare function createOAuthAuthorizationUrl(provider: OAuthProviderName, state: string): string;
export declare function fetchOAuthIdentity(provider: OAuthProviderName, code: string): Promise<OAuthIdentity>;
export declare function encodeOAuthStatePayload(payload: OAuthStatePayload): string;
export declare function decodeOAuthStatePayload(value: string): OAuthStatePayload;
export declare const oauthStateTtlSeconds: number;
//# sourceMappingURL=oauth.providers.d.ts.map