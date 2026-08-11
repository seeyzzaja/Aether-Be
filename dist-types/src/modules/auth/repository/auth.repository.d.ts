export declare class AuthRepository {
    findUserByEmail(email: string): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string;
        emailNotificationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
    findUserById(id: string): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string;
        emailNotificationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
    findSessionById(sessionId: string): Promise<{
        id: string;
        userId: string;
        refreshTokenHash: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        expiresAt: Date;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createUser(data: {
        email: string;
        username: string;
        passwordHash: string;
    }): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string;
        emailNotificationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
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
        deviceInfo: string | null;
        ipAddress: string | null;
        expiresAt: Date;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
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
        deviceInfo: string | null;
        ipAddress: string | null;
        expiresAt: Date;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    revokeSession(sessionId: string, userId: string): Promise<import("../../../prisma/generated/prisma/internal/prismaNamespace.js").BatchPayload>;
}
export declare const authRepository: AuthRepository;
//# sourceMappingURL=auth.repository.d.ts.map