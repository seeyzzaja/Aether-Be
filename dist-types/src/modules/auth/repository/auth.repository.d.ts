import type { AuthTokenType, OAuthProvider } from "#prisma/generated/prisma/client";
export declare class AuthRepository {
    findUserByUsername(username: string): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string | null;
        emailVerifiedAt: Date | null;
        emailNotificationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
    findUserByEmail(email: string): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string | null;
        emailVerifiedAt: Date | null;
        emailNotificationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
    findUserById(id: string): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string | null;
        emailVerifiedAt: Date | null;
        emailNotificationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
    createUser(data: {
        email: string;
        username: string;
        passwordHash: string | null;
        emailVerifiedAt?: Date | null;
    }): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string | null;
        emailVerifiedAt: Date | null;
        emailNotificationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    createUserWithUniqueUsername(data: {
        email: string;
        username: string;
        passwordHash: string | null;
        emailVerifiedAt?: Date | null;
    }): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string | null;
        emailVerifiedAt: Date | null;
        emailNotificationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    updateUserPassword(userId: string, passwordHash: string): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string | null;
        emailVerifiedAt: Date | null;
        emailNotificationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    verifyUserEmail(userId: string): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string | null;
        emailVerifiedAt: Date | null;
        emailNotificationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    createAuthToken(data: {
        userId: string;
        type: AuthTokenType;
        tokenHash: string;
        expiresAt: Date;
    }): Promise<{
        id: string;
        userId: string;
        type: AuthTokenType;
        tokenHash: string;
        expiresAt: Date;
        usedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findValidAuthToken(tokenHash: string, type: AuthTokenType): Promise<{
        id: string;
        userId: string;
        type: AuthTokenType;
        tokenHash: string;
        expiresAt: Date;
        usedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    markAuthTokenUsed(tokenId: string): Promise<{
        id: string;
        userId: string;
        type: AuthTokenType;
        tokenHash: string;
        expiresAt: Date;
        usedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    invalidateAuthTokens(userId: string, type: AuthTokenType): Promise<import("../../../prisma/generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    findSessionById(sessionId: string): Promise<{
        id: string;
        userId: string;
        refreshTokenHash: string;
        expiresAt: Date;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deviceInfo: string | null;
        ipAddress: string | null;
    } | null>;
    findSessionByRefreshTokenHash(refreshTokenHash: string): Promise<({
        user: {
            id: string;
            email: string;
            username: string;
            passwordHash: string | null;
            emailVerifiedAt: Date | null;
            emailNotificationEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        userId: string;
        refreshTokenHash: string;
        expiresAt: Date;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deviceInfo: string | null;
        ipAddress: string | null;
    }) | null>;
    createSession(data: {
        id: string;
        userId: string;
        refreshTokenHash: string;
        expiresAt: Date;
        deviceInfo: string | null;
        ipAddress: string | null;
    }): Promise<{
        id: string;
        userId: string;
        refreshTokenHash: string;
        expiresAt: Date;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deviceInfo: string | null;
        ipAddress: string | null;
    }>;
    findActiveSessionsByUserId(userId: string): Promise<{
        createdAt: Date;
        deviceInfo: string | null;
        expiresAt: Date;
        id: string;
        ipAddress: string | null;
        updatedAt: Date;
    }[]>;
    updateSessionRefreshToken(sessionId: string, refreshTokenHash: string, expiresAt: Date): Promise<{
        id: string;
        userId: string;
        refreshTokenHash: string;
        expiresAt: Date;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deviceInfo: string | null;
        ipAddress: string | null;
    }>;
    revokeSession(sessionId: string, userId: string): Promise<import("../../../prisma/generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    findOAuthAccount(provider: OAuthProvider, providerAccountId: string): Promise<({
        user: {
            id: string;
            email: string;
            username: string;
            passwordHash: string | null;
            emailVerifiedAt: Date | null;
            emailNotificationEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        userId: string;
        provider: OAuthProvider;
        providerAccountId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findOAuthAccountWithUser(provider: OAuthProvider, providerAccountId: string): Promise<({
        user: {
            id: string;
            email: string;
            username: string;
            passwordHash: string | null;
            emailVerifiedAt: Date | null;
            emailNotificationEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        userId: string;
        provider: OAuthProvider;
        providerAccountId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    createOAuthAccount(userId: string, provider: OAuthProvider, providerAccountId: string): Promise<{
        id: string;
        userId: string;
        provider: OAuthProvider;
        providerAccountId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findUserByOAuthProvider(provider: OAuthProvider): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string | null;
        emailVerifiedAt: Date | null;
        emailNotificationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
    findUserByEmailWithOAuthAccounts(email: string): Promise<({
        oauthAccounts: {
            id: string;
            userId: string;
            provider: OAuthProvider;
            providerAccountId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        email: string;
        username: string;
        passwordHash: string | null;
        emailVerifiedAt: Date | null;
        emailNotificationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null>;
    updateUserEmailVerifiedAt(userId: string, emailVerifiedAt: Date): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string | null;
        emailVerifiedAt: Date | null;
        emailNotificationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
export declare const authRepository: AuthRepository;
//# sourceMappingURL=auth.repository.d.ts.map