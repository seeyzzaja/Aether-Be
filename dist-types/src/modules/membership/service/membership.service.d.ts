export declare class MembershipService {
    private membershipRoleRepository;
    private getActorPermissions;
    join(serverId: string, userId: string): Promise<{
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
    leave(serverId: string, userId: string): Promise<void>;
    getMyServers(userId: string): Promise<{
        createdAt: Date;
        id: string;
        server: {
            createdAt: Date;
            id: string;
            name: string;
            ownerId: string;
        };
        serverId: string;
    }[]>;
    assignRole(serverId: string, actorId: string, memberId: string, roleId: string): Promise<{
        serverMemberId: string;
        roleId: string;
        role: {
            id: string;
            serverId: string;
            name: string;
            color: string | null;
            position: number;
            isDefault: boolean;
            permissionsBitmask: string;
        };
    }>;
    removeRole(serverId: string, actorId: string, memberId: string, roleId: string): Promise<void>;
}
export declare const membershipService: MembershipService;
//# sourceMappingURL=membership.service.d.ts.map