export declare class UploadRepository {
    findChannelContext(channelId: string): Promise<{
        id: string;
        server: {
            id: string;
            ownerId: string;
        };
        serverId: string;
    } | null>;
    findMemberPermissions(serverId: string, userId: string): Promise<{
        id: string;
        roles: {
            role: {
                permissionsBitmask: bigint;
            };
        }[];
    } | null>;
}
export declare const uploadRepository: UploadRepository;
//# sourceMappingURL=upload.repository.d.ts.map