import type { CreateChannelInput, UpdateChannelInput } from "../schema/channel.schema.js";
export declare class ChannelService {
    private ensureServerAccess;
    private ensureOwner;
    private ensureChannelBelongsToServer;
    private ensureCategoryBelongsToServer;
    create(serverId: string, userId: string, data: CreateChannelInput): Promise<{
        id: string;
        serverId: string;
        categoryId: string | null;
        name: string;
        type: import("../../../prisma/generated/prisma/enums.js").ChannelType;
        topic: string | null;
        position: number;
    }>;
    getAll(serverId: string, userId: string): Promise<{
        id: string;
        serverId: string;
        categoryId: string | null;
        name: string;
        type: import("../../../prisma/generated/prisma/enums.js").ChannelType;
        topic: string | null;
        position: number;
    }[]>;
    getById(serverId: string, channelId: string, userId: string): Promise<{
        id: string;
        serverId: string;
        categoryId: string | null;
        name: string;
        type: import("../../../prisma/generated/prisma/enums.js").ChannelType;
        topic: string | null;
        position: number;
    }>;
    update(serverId: string, channelId: string, userId: string, data: UpdateChannelInput): Promise<{
        id: string;
        serverId: string;
        categoryId: string | null;
        name: string;
        type: import("../../../prisma/generated/prisma/enums.js").ChannelType;
        topic: string | null;
        position: number;
    }>;
    delete(serverId: string, channelId: string, userId: string): Promise<void>;
    private ensureCanManageChannelPermissions;
    getPermissionOverrides(serverId: string, channelId: string, userId: string): Promise<{
        id: string;
        channelId: string;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
        allowBitmask: string;
        denyBitmask: string;
        role: {
            id: string;
            serverId: string;
            name: string;
            color: string | null;
            position: number;
            isDefault: boolean;
            permissionsBitmask: string;
        };
    }[]>;
    upsertPermissionOverride(serverId: string, channelId: string, roleId: string, userId: string, data: {
        allowBitmask: string;
        denyBitmask: string;
    }): Promise<{
        id: string;
        channelId: string;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
        allowBitmask: string;
        denyBitmask: string;
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
    deletePermissionOverride(serverId: string, channelId: string, roleId: string, userId: string): Promise<void>;
}
export declare const channelService: ChannelService;
//# sourceMappingURL=channel.service.d.ts.map