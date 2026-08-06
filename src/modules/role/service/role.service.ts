import { RoleRepository } from "#modules/role/repository/role.repository.js";
import { ForbiddenError, NotFoundError } from "#shared/errors/app-error.js";
import { Permission } from "#shared/permissions/permissions.js";
import { canAssignPermissions } from "#utils/permission.js";
import prisma from "#utils/prisma.js";

export class RoleService {
  private roleRepository: RoleRepository;

  constructor() {
    this.roleRepository = new RoleRepository();
  }

  private async getActorPermissions(serverId: string, userId: string): Promise<bigint> {
    const server = await prisma.server.findUnique({
      where: {
        id: serverId,
      },
      select: {
        ownerId: true,
      },
    });

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    if (server.ownerId === userId) {
      return Permission.ADMINISTRATOR;
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

    return member.roles.reduce<bigint>(
      (total, memberRole) => total | memberRole.role.permissionsBitmask,
      0n,
    );
  }

  async createRole(
    serverId: string,
    userId: string,
    input: {
      name: string;
      permissions: string;
    },
  ) {
    const actorPermissions = await this.getActorPermissions(serverId, userId);
    const permissions = BigInt(input.permissions);

    const allowed = canAssignPermissions(actorPermissions, permissions);

    if (!allowed) {
      throw new ForbiddenError("Tidak dapat memberikan permission melebihi permission sendiri");
    }

    return this.roleRepository.create(serverId, {
      name: input.name,
      permissionsBitmask: permissions,
    });
  }
  async getRoles(serverId: string) {
    return this.roleRepository.findAll(serverId);
  }

  async getRoleById(roleId: string, serverId: string) {
    const role = await this.roleRepository.findById(roleId, serverId);

    if (!role) {
      throw new NotFoundError("Role tidak ditemukan");
    }

    return role;
  }

  async updateRole(
    roleId: string,
    serverId: string,
    userId: string,
    input: {
      name?: string;
      permissions?: string;
      color?: string;
    },
  ) {
    const actorPermissions = await this.getActorPermissions(serverId, userId);

    const data: {
      name?: string;
      permissionsBitmask?: bigint;
      color?: string;
    } = {};

    if (input.name) {
      data.name = input.name;
    }

    if (input.color) {
      data.color = input.color;
    }

    if (input.permissions) {
      const permissions = BigInt(input.permissions);

      const allowed = canAssignPermissions(actorPermissions, permissions);

      if (!allowed) {
        throw new ForbiddenError("Permission melebihi permission actor");
      }

      data.permissionsBitmask = permissions;
    }

    return this.roleRepository.update(roleId, serverId, data);
  }

  async deleteRole(roleId: string, serverId: string) {
    return this.roleRepository.delete(roleId, serverId);
  }
}
