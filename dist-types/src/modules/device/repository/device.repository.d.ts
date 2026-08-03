export declare class DeviceRepository {
    findActiveSessionsByUserId(userId: string): Promise<{
        createdAt: Date;
        deviceInfo: string | null;
        expiresAt: Date;
        id: string;
        ipAddress: string | null;
        updatedAt: Date;
    }[]>;
    revokeSession(sessionId: string, userId: string): Promise<import("../../../prisma/generated/prisma/internal/prismaNamespace").BatchPayload>;
}
export declare const deviceRepository: DeviceRepository;
//# sourceMappingURL=device.repository.d.ts.map