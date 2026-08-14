type SearchType = "all" | "messages" | "servers" | "channels";
export declare class SearchService {
    search(serverId: string, userId: string, input: {
        q: string;
        type: SearchType;
        limit: number;
        offset: number;
        channelId?: string;
    }): Promise<{
        messages: never[] | {
            id: string;
            channelId: string;
            authorId: string;
            content: string;
            createdAt: Date;
            rank: number;
        }[];
        servers: never[] | {
            id: string;
            name: string;
            ownerId: string;
            rank: number;
        }[];
        channels: never[] | {
            id: string;
            serverId: string;
            name: string;
            topic: string | null;
            rank: number;
        }[];
        type: SearchType;
        offset: number;
        limit: number;
    }>;
}
export declare const searchService: SearchService;
export {};
//# sourceMappingURL=search.service.d.ts.map