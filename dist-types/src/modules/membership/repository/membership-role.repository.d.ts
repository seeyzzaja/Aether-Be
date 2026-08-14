export declare class MembershipRoleRepository {
    assign(serverMemberId: string, roleId: string): Promise<{
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
    remove(serverMemberId: string, roleId: string): Promise<{
        id: string;
        serverMemberId: string;
        roleId: string;
        createdAt: Date;
    }>;
    findMemberRoles(serverMemberId: string): Promise<({
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
    })[]>;
}
//# sourceMappingURL=membership-role.repository.d.ts.map