import type { NextFunction, Request, Response } from "express";
import { createChannelSchema, updateChannelSchema } from "#modules/channel/schema/channel.schema";
import { upsertChannelPermissionOverrideSchema } from "#modules/channel/schema/channel-permission-override.schema";
import { channelService } from "#modules/channel/service/channel.service";
import { BadRequestError, UnauthorizedError } from "#shared/errors/app-error";
import { successResponse } from "#utils/response";

export class ChannelController {
  private getServerId(req: Request): string {
    const { serverId } = req.params;

    if (typeof serverId !== "string" || !serverId) {
      throw new BadRequestError("Server ID tidak valid");
    }

    return serverId;
  }

  private getChannelId(req: Request): string {
    const { channelId } = req.params;

    if (typeof channelId !== "string" || !channelId) {
      throw new BadRequestError("Channel ID tidak valid");
    }

    return channelId;
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
      const userId = this.getUserId(req);
      const serverId = this.getServerId(req);

      const validatedData = createChannelSchema.parse(req.body);

      const channel = await channelService.create(serverId, userId, validatedData);

      return successResponse(res, "Channel berhasil dibuat", channel, null, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const serverId = this.getServerId(req);

      const channels = await channelService.getAll(serverId, userId);

      return successResponse(res, "Daftar channel berhasil diambil", channels);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const serverId = this.getServerId(req);
      const channelId = this.getChannelId(req);

      const channel = await channelService.getById(serverId, channelId, userId);

      return successResponse(res, "Detail channel berhasil diambil", channel);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const serverId = this.getServerId(req);
      const channelId = this.getChannelId(req);

      const validatedData = updateChannelSchema.parse(req.body);

      const channel = await channelService.update(serverId, channelId, userId, validatedData);

      return successResponse(res, "Channel berhasil diperbarui", channel);
    } catch (error) {
      next(error);
    }
  }
  async getPermissionOverrides(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const serverId = this.getServerId(req);
      const channelId = this.getChannelId(req);

      const overrides = await channelService.getPermissionOverrides(serverId, channelId, userId);

      return successResponse(res, "Permission override berhasil diambil", overrides);
    } catch (error) {
      next(error);
    }
  }
  async upsertPermissionOverride(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const serverId = this.getServerId(req);
      const channelId = this.getChannelId(req);

      const { roleId } = req.params;

      if (typeof roleId !== "string" || !roleId) {
        throw new BadRequestError("Role ID tidak valid");
      }

      const validatedData = upsertChannelPermissionOverrideSchema.parse(req.body);

      const override = await channelService.upsertPermissionOverride(
        serverId,
        channelId,
        roleId,
        userId,
        validatedData,
      );

      return successResponse(res, "Permission override berhasil disimpan", override);
    } catch (error) {
      next(error);
    }
  }
  async deletePermissionOverride(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const serverId = this.getServerId(req);
      const channelId = this.getChannelId(req);

      const { roleId } = req.params;

      if (typeof roleId !== "string" || !roleId) {
        throw new BadRequestError("Role ID tidak valid");
      }

      await channelService.deletePermissionOverride(serverId, channelId, roleId, userId);

      return successResponse(res, "Permission override berhasil dihapus");
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserId(req);
      const serverId = this.getServerId(req);
      const channelId = this.getChannelId(req);

      await channelService.delete(serverId, channelId, userId);

      return successResponse(res, "Channel berhasil dihapus");
    } catch (error) {
      next(error);
    }
  }
}

export const channelController = new ChannelController();
