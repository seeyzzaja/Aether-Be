import { ForbiddenError, NotFoundError } from "#shared/errors/app-error";
import { Permission } from "#shared/permissions/permissions";
import prisma from "#utils/prisma";
import { channelRepository } from "../repository/channel.repository.js";
import type { CreateChannelInput, UpdateChannelInput } from "../schema/channel.schema.js";

export class ChannelService {
  private async ensureServerAccess(serverId: string, userId: string) {
    const server = await channelRepository.findServerById(serverId);

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    if (server.ownerId === userId) {
      return server;
    }

    const member = await channelRepository.findMember(serverId, userId);

    if (!member) {
      throw new ForbiddenError("Kamu bukan member dari server ini");
    }

    return server;
  }

  private async ensureOwner(serverId: string, userId: string) {
    const server = await channelRepository.findServerById(serverId);

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    if (server.ownerId !== userId) {
      throw new ForbiddenError("Hanya Owner yang dapat mengelola channel");
    }

    return server;
  }

  private async ensureChannelBelongsToServer(serverId: string, channelId: string) {
    const channel = await channelRepository.findById(channelId);

    if (!channel || channel.serverId !== serverId) {
      throw new NotFoundError("Channel tidak ditemukan");
    }

    return channel;
  }

  private async ensureCategoryBelongsToServer(serverId: string, categoryId: string) {
    const category = await channelRepository.findCategoryById(categoryId);

    if (!category || category.serverId !== serverId) {
      throw new NotFoundError("Category tidak ditemukan di server ini");
    }

    return category;
  }

  async create(serverId: string, userId: string, data: CreateChannelInput) {
    await this.ensureOwner(serverId, userId);

    if (data.categoryId) {
      await this.ensureCategoryBelongsToServer(serverId, data.categoryId);
    }

    const position = await channelRepository.getNextPosition(serverId, data.categoryId);

    return channelRepository.create(serverId, data, position);
  }

  async getAll(serverId: string, userId: string) {
    await this.ensureServerAccess(serverId, userId);

    return channelRepository.findAllByServerId(serverId);
  }

  async getById(serverId: string, channelId: string, userId: string) {
    await this.ensureServerAccess(serverId, userId);

    return this.ensureChannelBelongsToServer(serverId, channelId);
  }

  async update(serverId: string, channelId: string, userId: string, data: UpdateChannelInput) {
    await this.ensureOwner(serverId, userId);

    await this.ensureChannelBelongsToServer(serverId, channelId);

    if (data.categoryId) {
      await this.ensureCategoryBelongsToServer(serverId, data.categoryId);
    }

    return channelRepository.update(channelId, data);
  }

  async delete(serverId: string, channelId: string, userId: string) {
    await this.ensureOwner(serverId, userId);

    await this.ensureChannelBelongsToServer(serverId, channelId);

    await channelRepository.delete(channelId);
  }
  private async ensureCanManageChannelPermissions(serverId: string, userId: string) {
    const server = await channelRepository.findServerById(serverId);

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    if (server.ownerId === userId) {
      return;
    }

    const member = await prisma.serverMember.findUnique({
      where: {
        serverId_userId: {
          serverId,
          userId,
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!member) {
      throw new ForbiddenError("Kamu bukan member dari server ini");
    }

    const permissions = member.roles.reduce(
      (total: bigint, memberRole: { role: { permissionsBitmask: bigint } }) =>
        total | memberRole.role.permissionsBitmask,
      0n,
    );

    if (
      (permissions & Permission.ADMINISTRATOR) === 0n &&
      (permissions & Permission.MANAGE_CHANNELS) === 0n
    ) {
      throw new ForbiddenError("Kamu tidak memiliki permission untuk mengelola permission channel");
    }
  }
  async getPermissionOverrides(serverId: string, channelId: string, userId: string) {
    await this.ensureCanManageChannelPermissions(serverId, userId);
    await this.ensureChannelBelongsToServer(serverId, channelId);

    const overrides = await channelRepository.findPermissionOverrides(channelId);

    return overrides.map((override) => ({
      ...override,
      allowBitmask: override.allowBitmask.toString(),
      denyBitmask: override.denyBitmask.toString(),
      role: {
        ...override.role,
        permissionsBitmask: override.role.permissionsBitmask.toString(),
      },
    }));
  }
  async upsertPermissionOverride(
    serverId: string,
    channelId: string,
    roleId: string,
    userId: string,
    data: {
      allowBitmask: string;
      denyBitmask: string;
    },
  ) {
    await this.ensureCanManageChannelPermissions(serverId, userId);

    await this.ensureChannelBelongsToServer(serverId, channelId);

    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        serverId,
      },
    });

    if (!role) {
      throw new NotFoundError("Role tidak ditemukan di server ini");
    }

    let allowBitmask: bigint;
    let denyBitmask: bigint;

    try {
      allowBitmask = BigInt(data.allowBitmask);
      denyBitmask = BigInt(data.denyBitmask);
    } catch {
      throw new ForbiddenError("Permission bitmask tidak valid");
    }

    if (allowBitmask < 0n || denyBitmask < 0n) {
      throw new ForbiddenError("Permission bitmask tidak boleh negatif");
    }

    const override = await channelRepository.upsertPermissionOverride(
      channelId,
      roleId,
      allowBitmask,
      denyBitmask,
    );

    return {
      ...override,
      allowBitmask: override.allowBitmask.toString(),
      denyBitmask: override.denyBitmask.toString(),
      role: {
        ...override.role,
        permissionsBitmask: override.role.permissionsBitmask.toString(),
      },
    };
  }
  async deletePermissionOverride(
    serverId: string,
    channelId: string,
    roleId: string,
    userId: string,
  ) {
    await this.ensureCanManageChannelPermissions(serverId, userId);

    await this.ensureChannelBelongsToServer(serverId, channelId);

    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        serverId,
      },
    });

    if (!role) {
      throw new NotFoundError("Role tidak ditemukan di server ini");
    }

    const override = await channelRepository.findPermissionOverride(channelId, roleId);

    if (!override) {
      throw new NotFoundError("Permission override tidak ditemukan");
    }

    await channelRepository.deletePermissionOverride(channelId, roleId);
  }
}

export const channelService = new ChannelService();
