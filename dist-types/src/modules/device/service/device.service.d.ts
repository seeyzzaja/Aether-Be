export declare class DeviceService {
    getActiveSessions(userId: string): Promise<{
        createdAt: Date;
        deviceInfo: string | null;
        expiresAt: Date;
        id: string;
        ipAddress: string | null;
        updatedAt: Date;
    }[]>;
    revokeSession(sessionId: string, userId: string): Promise<void>;
}
export declare const deviceService: DeviceService;
//# sourceMappingURL=device.service.d.ts.map