export declare class RoleRepository {
    create(serverId: string, data: {
        name: string;
        permissionsBitmask: bigint;
    }): Promise<{
        id: string;
        serverId: string;
        name: string;
        color: string | null;
        position: number;
        isDefault: boolean;
        permissionsBitmask: string;
    }>;
    findAll(serverId: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        color: string | null;
        position: number;
        isDefault: boolean;
        permissionsBitmask: string;
    }[]>;
    findById(roleId: string, serverId: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        color: string | null;
        position: number;
        isDefault: boolean;
        permissionsBitmask: string;
    } | null>;
    update(roleId: string, serverId: string, data: {
        name?: string;
        permissionsBitmask?: bigint;
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
    delete(roleId: string, serverId: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        color: string | null;
        permissionsBitmask: bigint;
        position: number;
        isDefault: boolean;
    }>;
}
//# sourceMappingURL=role.repository.d.ts.map