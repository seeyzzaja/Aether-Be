export declare function seedRole(serverId: string): Promise<{
    defaultRole: {
        id: string;
        serverId: string;
        name: string;
        color: string | null;
        permissionsBitmask: bigint;
        position: number;
        isDefault: boolean;
    };
    ownerRole: {
        id: string;
        serverId: string;
        name: string;
        color: string | null;
        permissionsBitmask: bigint;
        position: number;
        isDefault: boolean;
    };
}>;
//# sourceMappingURL=role.seed.d.ts.map