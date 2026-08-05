import type { NextFunction, Request, Response } from "express";

import { categoryService } from "#modules/category/service/category.service";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

import { createCategorySchema, updateCategorySchema } from "../schema/category.schema.js";

export class CategoryController {
  private getServerId(req: Request): string {
    const { serverId } = req.params;

    if (typeof serverId !== "string" || !serverId) {
      throw new BadRequestError("Server ID tidak valid");
    }

    return serverId;
  }

  private getCategoryId(req: Request): string {
    const { categoryId } = req.params;

    if (typeof categoryId !== "string" || !categoryId) {
      throw new BadRequestError("Category ID tidak valid");
    }

    return categoryId;
  }

  private getUserId(req: Request): string {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("User tidak ditemukan pada token");
    }

    return user.userId;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const serverId = this.getServerId(req);
      const userId = this.getUserId(req);

      const validatedData = createCategorySchema.parse(req.body);

      const category = await categoryService.create(serverId, userId, validatedData);

      return successResponse(res, "Category berhasil dibuat", category, null, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const serverId = this.getServerId(req);
      const userId = this.getUserId(req);

      const categories = await categoryService.getAll(serverId, userId);

      return successResponse(res, "Daftar category berhasil diambil", categories);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const serverId = this.getServerId(req);
      const categoryId = this.getCategoryId(req);
      const userId = this.getUserId(req);

      const category = await categoryService.getById(serverId, categoryId, userId);

      return successResponse(res, "Detail category berhasil diambil", category);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const serverId = this.getServerId(req);
      const categoryId = this.getCategoryId(req);
      const userId = this.getUserId(req);

      const validatedData = updateCategorySchema.parse(req.body);

      const category = await categoryService.update(serverId, categoryId, userId, validatedData);

      return successResponse(res, "Category berhasil diperbarui", category);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const serverId = this.getServerId(req);
      const categoryId = this.getCategoryId(req);
      const userId = this.getUserId(req);

      await categoryService.delete(serverId, categoryId, userId);

      return successResponse(res, "Category berhasil dihapus");
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
