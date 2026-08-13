export declare class MembershipRepository {
    findAll(): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findServerById(serverId: string): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findMember(serverId: string, userId: string): Promise<({
        roles: ({
            role: {
                id: string;
                serverId: string;
                name: string;
                color: string | null;
                permissionsBitmask: bigint;
                position: number;
                isDefault: boolean;
            };
        } & {
            id: string;
            serverMemberId: string;
            roleId: string;
            createdAt: Date;
        })[];
        user: {
            email: string;
            id: string;
            username: string;
        };
    } & {
        id: string;
        serverId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findDefaultRole(serverId: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        color: string | null;
        permissionsBitmask: bigint;
        position: number;
        isDefault: boolean;
    } | null>;
    createMember(serverId: string, userId: string, roleId: string): Promise<{
        roleId: string;
        role: {
            id: string;
        };
        createdAt: Date;
        id: string;
        serverId: string;
        user: {
            email: string;
            id: string;
            username: string;
        };
        userId: string;
    }>;
    deleteMember(serverId: string, userId: string): Promise<{
        id: string;
        serverId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const membershipRepository: MembershipRepository;
//# sourceMappingURL=membership.repository.d.ts.map