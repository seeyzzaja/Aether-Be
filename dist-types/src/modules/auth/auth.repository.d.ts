export declare class AuthRepository {
    findUserByEmail(email: string): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
    findUserById(id: string): Promise<{
        id: string;
        email: string;
        username: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
    findSessionById(sessionId: string): Promise<{
        id: string;
        userId: string;
        refreshTokenHash: string;
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
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    createSession(data: {
        id: string;
        userId: string;
        refreshTokenHash: string;
        expiresAt: Date;
    }): Promise<{
        id: string;
        userId: string;
        refreshTokenHash: string;
        expiresAt: Date;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSessionRefreshToken(sessionId: string, refreshTokenHash: string, expiresAt: Date): Promise<{
        id: string;
        userId: string;
        refreshTokenHash: string;
        expiresAt: Date;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const authRepository: AuthRepository;
//# sourceMappingURL=auth.repository.d.ts.map