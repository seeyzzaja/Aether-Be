import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "#modules/category/schema/category.schema";
import prisma from "#utils/prisma";

export class CategoryRepository {
  async findServerById(serverId: string) {
    return prisma.server.findUnique({
      where: {
        id: serverId,
      },
    });
  }

  async findMember(serverId: string, userId: string) {
    return prisma.serverMember.findUnique({
      where: {
        serverId_userId: {
          serverId,
          userId,
        },
      },
    });
  }

  async findById(categoryId: string) {
    return prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
  }
  async findAllByServerId(serverId: string) {
    return prisma.category.findMany({
      where: {
        serverId,
      },
      orderBy: {
        position: "asc",
      },
    });
  }

  async getNextPosition(serverId: string) {
    const lastCategory = await prisma.category.findFirst({
      where: {
        serverId,
      },
      orderBy: {
        position: "desc",
      },
      select: {
        position: true,
      },
    });

    return lastCategory ? lastCategory.position + 1 : 0;
  }

  async create(serverId: string, data: CreateCategoryInput, position: number) {
    return prisma.category.create({
      data: {
        serverId,
        name: data.name,
        position,
      },
    });
  }

  async update(categoryId: string, data: UpdateCategoryInput) {
    return prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: data.name,
      },
    });
  }

  async delete(categoryId: string) {
    return prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}

export const categoryRepository = new CategoryRepository();
