import type { CreateServerInput, UpdateServerInput } from "../schema/server.schema.js";
export declare class ServerService {
    create(ownerId: string, data: CreateServerInput): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllByOwnerId(ownerId: string): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getAll(): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getById(serverId: string): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(serverId: string, userId: string, data: UpdateServerInput): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(serverId: string, userId: string): Promise<void>;
}
export declare const serverService: ServerService;
//# sourceMappingURL=server.service.d.ts.map