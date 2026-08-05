import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "#modules/category/schema/category.schema";
import { ForbiddenError, NotFoundError } from "#shared/errors/app-error";

import { categoryRepository } from "../repository/category.repository.js";

export class CategoryService {
  private async ensureServerAccess(serverId: string, userId: string) {
    const server = await categoryRepository.findServerById(serverId);

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    if (server.ownerId === userId) {
      return server;
    }

    const member = await categoryRepository.findMember(serverId, userId);

    if (!member) {
      throw new ForbiddenError("Kamu bukan member dari server ini");
    }

    return server;
  }

  private async ensureOwner(serverId: string, userId: string) {
    const server = await categoryRepository.findServerById(serverId);

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    if (server.ownerId !== userId) {
      throw new ForbiddenError("Hanya Owner yang dapat mengelola category");
    }

    return server;
  }

  private async ensureCategoryBelongsToServer(serverId: string, categoryId: string) {
    const category = await categoryRepository.findById(categoryId);

    if (!category || category.serverId !== serverId) {
      throw new NotFoundError("Category tidak ditemukan");
    }

    return category;
  }

  async create(serverId: string, userId: string, data: CreateCategoryInput) {
    await this.ensureOwner(serverId, userId);

    const position = await categoryRepository.getNextPosition(serverId);

    return categoryRepository.create(serverId, data, position);
  }

  async getAll(serverId: string, userId: string) {
    await this.ensureServerAccess(serverId, userId);

    return categoryRepository.findAllByServerId(serverId);
  }

  async getById(serverId: string, categoryId: string, userId: string) {
    await this.ensureServerAccess(serverId, userId);

    return this.ensureCategoryBelongsToServer(serverId, categoryId);
  }

  async update(serverId: string, categoryId: string, userId: string, data: UpdateCategoryInput) {
    await this.ensureOwner(serverId, userId);

    await this.ensureCategoryBelongsToServer(serverId, categoryId);

    return categoryRepository.update(categoryId, data);
  }

  async delete(serverId: string, categoryId: string, userId: string) {
    await this.ensureOwner(serverId, userId);

    await this.ensureCategoryBelongsToServer(serverId, categoryId);

    await categoryRepository.delete(categoryId);
  }
}

export const categoryService = new CategoryService();
