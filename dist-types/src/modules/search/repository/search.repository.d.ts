export declare class SearchRepository {
    findServer(serverId: string): Promise<{
        id: string;
        ownerId: string;
    } | null>;
    findMember(serverId: string, userId: string): Promise<{
        roles: {
            role: {
                permissionsBitmask: bigint;
            };
        }[];
    } | null>;
    findChannel(channelId: string): Promise<{
        id: string;
        serverId: string;
    } | null>;
    searchMessages(serverId: string, query: string, options?: {
        channelId?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        id: string;
        channelId: string;
        authorId: string;
        content: string;
        createdAt: Date;
        rank: number;
    }[]>;
    searchServers(query: string, limit?: number, serverId?: string): Promise<{
        id: string;
        name: string;
        ownerId: string;
        rank: number;
    }[]>;
    searchChannels(query: string, limit?: number, serverId?: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        topic: string | null;
        rank: number;
    }[]>;
}
export declare const searchRepository: SearchRepository;
//# sourceMappingURL=search.repository.d.ts.map