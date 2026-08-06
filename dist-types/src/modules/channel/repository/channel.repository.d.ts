import type { CreateChannelInput, UpdateChannelInput } from "#modules/channel/schema/channel.schema";
export declare class ChannelRepository {
    findServerById(serverId: string): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findCategoryById(categoryId: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findMember(serverId: string, userId: string): Promise<{
        id: string;
        serverId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getNextPosition(serverId: string, categoryId?: string | null): Promise<number>;
    create(serverId: string, data: CreateChannelInput, position: number): Promise<{
        id: string;
        serverId: string;
        categoryId: string | null;
        name: string;
        type: import("../../../prisma/generated/prisma/enums").ChannelType;
        topic: string | null;
        position: number;
    }>;
    findAllByServerId(serverId: string): Promise<{
        id: string;
        serverId: string;
        categoryId: string | null;
        name: string;
        type: import("../../../prisma/generated/prisma/enums").ChannelType;
        topic: string | null;
        position: number;
    }[]>;
    findById(channelId: string): Promise<{
        id: string;
        serverId: string;
        categoryId: string | null;
        name: string;
        type: import("../../../prisma/generated/prisma/enums").ChannelType;
        topic: string | null;
        position: number;
    } | null>;
    update(channelId: string, data: UpdateChannelInput): Promise<{
        id: string;
        serverId: string;
        categoryId: string | null;
        name: string;
        type: import("../../../prisma/generated/prisma/enums").ChannelType;
        topic: string | null;
        position: number;
    }>;
    delete(channelId: string): Promise<{
        id: string;
        serverId: string;
        categoryId: string | null;
        name: string;
        type: import("../../../prisma/generated/prisma/enums").ChannelType;
        topic: string | null;
        position: number;
    }>;
}
export declare const channelRepository: ChannelRepository;
//# sourceMappingURL=channel.repository.d.ts.map