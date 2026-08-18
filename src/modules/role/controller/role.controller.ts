import type { Request, Response } from "express";

import { RoleService } from "#modules/role/service/role.service";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";

const roleService = new RoleService();

export class RoleController {
  async create(req: Request, res: Response, next: (error?: unknown) => void) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      const serverId = req.params.serverId;

      if (!serverId || Array.isArray(serverId)) {
        throw new BadRequestError("Server ID tidak valid");
      }

      const result = await roleService.createRole(serverId, user.userId, req.body);

      return res.status(201).json({
        success: true,
        message: "Role berhasil dibuat",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response) {
    const serverId = req.params.serverId;

    if (!serverId || Array.isArray(serverId)) {
      return res.status(400).json({
        success: false,
        message: "Server ID tidak valid",
      });
    }

    const result = await roleService.getRoles(serverId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }

  async findById(req: Request, res: Response) {
    const serverId = req.params.serverId;
    const roleId = req.params.roleId;

    if (!serverId || !roleId || Array.isArray(serverId) || Array.isArray(roleId)) {
      return res.status(400).json({
        success: false,
        message: "Parameter tidak valid",
      });
    }

    const result = await roleService.getRoleById(roleId, serverId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }

  async update(req: Request, res: Response, next: (error?: unknown) => void) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      const serverId = req.params.serverId;
      const roleId = req.params.roleId;

      if (!serverId || !roleId || Array.isArray(serverId) || Array.isArray(roleId)) {
        throw new BadRequestError("Parameter tidak valid");
      }

      const result = await roleService.updateRole(roleId, serverId, user.userId, req.body);

      return res.status(200).json({
        success: true,
        message: "Role berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: (error?: unknown) => void) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan pada token");
      }

      const serverId = req.params.serverId;
      const roleId = req.params.roleId;

      if (!serverId || !roleId || Array.isArray(serverId) || Array.isArray(roleId)) {
        throw new BadRequestError("Parameter tidak valid");
      }

      await roleService.deleteRole(roleId, serverId, user.userId);

      return res.status(200).json({
        success: true,
        message: "Role berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}
