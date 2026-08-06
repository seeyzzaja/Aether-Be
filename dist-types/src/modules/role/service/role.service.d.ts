export declare class RoleService {
    private roleRepository;
    constructor();
    private getActorPermissions;
    createRole(serverId: string, userId: string, input: {
        name: string;
        permissions: string;
    }): Promise<{
        id: string;
        serverId: string;
        name: string;
        color: string | null;
        position: number;
        isDefault: boolean;
        permissionsBitmask: string;
    }>;
    getRoles(serverId: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        color: string | null;
        position: number;
        isDefault: boolean;
        permissionsBitmask: string;
    }[]>;
    getRoleById(roleId: string, serverId: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        color: string | null;
        position: number;
        isDefault: boolean;
        permissionsBitmask: string;
    }>;
    updateRole(roleId: string, serverId: string, userId: string, input: {
        name?: string;
        permissions?: string;
        color?: string;
    }): Promise<{
        id: string;
        serverId: string;
        name: string;
        color: string | null;
        position: number;
        isDefault: boolean;
        permissionsBitmask: string;
    }>;
    deleteRole(roleId: string, serverId: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        color: string | null;
        permissionsBitmask: bigint;
        position: number;
        isDefault: boolean;
    }>;
}
//# sourceMappingURL=role.service.d.ts.map