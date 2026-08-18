import { auditService } from "#modules/audit/service/audit.service";
import { RoleRepository } from "#modules/role/repository/role.repository";
import { ForbiddenError, NotFoundError } from "#shared/errors/app-error";
import { Permission } from "#shared/permissions/permissions";
import { canAssignPermissions } from "#utils/permission";
import prisma from "#utils/prisma";

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

    return member.roles.reduce(
      (total: bigint, memberRole: { role: { permissionsBitmask: bigint } }) =>
        total | memberRole.role.permissionsBitmask,
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

    const role = await this.roleRepository.create(serverId, {
      name: input.name,
      permissionsBitmask: permissions,
    });

    await auditService.log({
      actorId: userId,
      action: "ROLE_CREATE",
      targetType: "ROLE",
      targetId: role.id,
      metadata: {
        serverId,
        name: input.name,
        permissions: input.permissions,
      },
    });

    return role;
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

    const role = await this.roleRepository.update(roleId, serverId, data);

    await auditService.log({
      actorId: userId,
      action: "ROLE_UPDATE",
      targetType: "ROLE",
      targetId: role.id,
      metadata: {
        serverId,
        changes: {
          name: input.name,
          permissions: input.permissions,
          color: input.color,
        },
      },
    });

    return role;
  }

  async deleteRole(roleId: string, serverId: string, userId: string) {
    const role = await this.roleRepository.findById(roleId, serverId);

    if (!role) {
      throw new NotFoundError("Role tidak ditemukan");
    }

    await this.roleRepository.delete(roleId, serverId);

    await auditService.log({
      actorId: userId,
      action: "ROLE_DELETE",
      targetType: "ROLE",
      targetId: roleId,
      metadata: {
        serverId,
        name: role.name,
      },
    });
  }
}

export const roleService = new RoleService();
