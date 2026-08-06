import type { CreateCategoryInput, UpdateCategoryInput } from "#modules/category/schema/category.schema";
export declare class CategoryService {
    private ensureServerAccess;
    private ensureOwner;
    private ensureCategoryBelongsToServer;
    create(serverId: string, userId: string, data: CreateCategoryInput): Promise<{
        id: string;
        serverId: string;
        name: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAll(serverId: string, userId: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getById(serverId: string, categoryId: string, userId: string): Promise<{
        id: string;
        serverId: string;
        name: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(serverId: string, categoryId: string, userId: string, data: UpdateCategoryInput): Promise<{
        id: string;
        serverId: string;
        name: string;
        position: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(serverId: string, categoryId: string, userId: string): Promise<void>;
}
export declare const categoryService: CategoryService;
//# sourceMappingURL=category.service.d.ts.map