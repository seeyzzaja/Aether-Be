import type { CreateCategoryInput, UpdateCategoryInput } from "#modules/category/schema/category.schema";
export declare class CategoryRepository {
    findServerById(serverId: string): Promise<{
        id: string;
        ownerId: string;
        name: string;
        iconUrl: string | null;
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
    findById(categoryId: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findAllByServerId(serverId: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getNextPosition(serverId: string): Promise<number>;
    create(serverId: string, data: CreateCategoryInput, position: number): Promise<{
        id: string;
        serverId: string;
        name: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(categoryId: string, data: UpdateCategoryInput): Promise<{
        id: string;
        serverId: string;
        name: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(categoryId: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const categoryRepository: CategoryRepository;
//# sourceMappingURL=category.repository.d.ts.map