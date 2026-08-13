import type { CreateServerInput, UpdateServerInput } from "#modules/server/schema/server.schema";
export declare class ServerRepository {
    create(ownerId: string, data: CreateServerInput): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllByOwnerId(ownerId: string): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findAll(): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findById(serverId: string): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    update(serverId: string, data: UpdateServerInput): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(serverId: string): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const serverRepository: ServerRepository;
//# sourceMappingURL=server.repository.d.ts.map