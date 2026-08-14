import { auditService } from "#modules/audit/service/audit.service";
import { MembershipRoleRepository } from "#modules/membership/repository/membership-role.repository";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "#shared/errors/app-error";
import { Permission } from "#shared/permissions/permissions";
import { canAssignPermissions, hasPermission } from "#utils/permission";
import prisma from "#utils/prisma";

import { membershipRepository } from "../repository/membership.repository.js";

export class MembershipService {
  private membershipRoleRepository = new MembershipRoleRepository();

  private async getActorPermissions(serverId: string, userId: string): Promise<bigint> {
    const server = await membershipRepository.findServerById(serverId);

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    // Owner memiliki seluruh permission.
    if (server.ownerId === userId) {
      return Permission.ADMINISTRATOR;
    }

    const member = await membershipRepository.findMember(serverId, userId);

    if (!member) {
      throw new ForbiddenError("Kamu bukan member dari server ini");
    }

    return member.roles.reduce(
      (total, memberRole) => total | memberRole.role.permissionsBitmask,
      0n,
    );
  }

  async join(serverId: string, userId: string) {
    const server = await membershipRepository.findServerById(serverId);

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    const existingMember = await membershipRepository.findMember(serverId, userId);

    if (existingMember) {
      throw new ConflictError("User sudah menjadi member server");
    }

    const defaultRole = await membershipRepository.findDefaultRole(serverId);

    if (!defaultRole) {
      throw new NotFoundError("Role default @everyone tidak ditemukan");
    }

    const member = await membershipRepository.createMember(serverId, userId, defaultRole.id);

    await auditService.log({
      actorId: userId,
      action: "SERVER_MEMBER_JOIN",
      targetType: "SERVER",
      targetId: serverId,
      metadata: {
        serverId,
        userId,
      },
    });

    return member;
  }

  async leave(serverId: string, userId: string) {
    const server = await membershipRepository.findServerById(serverId);

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    if (server.ownerId === userId) {
      throw new ForbiddenError("Owner tidak dapat meninggalkan server");
    }

    const member = await membershipRepository.findMember(serverId, userId);

    if (!member) {
      throw new NotFoundError("User bukan member dari server ini");
    }

    await membershipRepository.deleteMember(serverId, userId);

    await auditService.log({
      actorId: userId,
      action: "SERVER_MEMBER_LEAVE",
      targetType: "SERVER",
      targetId: serverId,
      metadata: {
        serverId,
        userId,
      },
    });
  }
  async getMyServers(userId: string) {
    return membershipRepository.findServersByUserId(userId);
  }
  async assignRole(serverId: string, actorId: string, memberId: string, roleId: string) {
    const actorPermissions = await this.getActorPermissions(serverId, actorId);

    if (!hasPermission(actorPermissions, Permission.MANAGE_ROLES)) {
      throw new ForbiddenError("Kamu tidak memiliki permission MANAGE_ROLES");
    }

    const targetMember = await prisma.serverMember.findFirst({
      where: {
        id: memberId,
        serverId,
      },
    });

    if (!targetMember) {
      throw new NotFoundError("Member tidak ditemukan di server ini");
    }

    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        serverId,
      },
    });

    if (!role) {
      throw new NotFoundError("Role tidak ditemukan di server ini");
    }

    if (!canAssignPermissions(actorPermissions, role.permissionsBitmask)) {
      throw new ForbiddenError(
        "Tidak dapat memberikan role dengan permission melebihi permission sendiri",
      );
    }

    const existingRole = await prisma.serverMemberRole.findUnique({
      where: {
        serverMemberId_roleId: {
          serverMemberId: memberId,
          roleId,
        },
      },
    });

    if (existingRole) {
      throw new ConflictError("Member sudah memiliki role tersebut");
    }

    const result = await this.membershipRoleRepository.assign(memberId, roleId);

    await auditService.log({
      actorId,
      action: "role.assign",
      targetType: "role",
      targetId: roleId,
      metadata: {
        serverId,
        memberId,
        roleId,
      },
    });

    return result;
  }

  async removeRole(serverId: string, actorId: string, memberId: string, roleId: string) {
    const actorPermissions = await this.getActorPermissions(serverId, actorId);

    if (!hasPermission(actorPermissions, Permission.MANAGE_ROLES)) {
      throw new ForbiddenError("Kamu tidak memiliki permission MANAGE_ROLES");
    }

    const targetMember = await prisma.serverMember.findFirst({
      where: {
        id: memberId,
        serverId,
      },
    });

    if (!targetMember) {
      throw new NotFoundError("Member tidak ditemukan di server ini");
    }

    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        serverId,
      },
    });

    if (!role) {
      throw new NotFoundError("Role tidak ditemukan di server ini");
    }

    if (role.isDefault) {
      throw new BadRequestError("Role @everyone tidak dapat dihapus dari member");
    }

    const memberRole = await prisma.serverMemberRole.findUnique({
      where: {
        serverMemberId_roleId: {
          serverMemberId: memberId,
          roleId,
        },
      },
    });

    if (!memberRole) {
      throw new NotFoundError("Member tidak memiliki role tersebut");
    }

    await this.membershipRoleRepository.remove(memberId, roleId);

    await auditService.log({
      actorId,
      action: "role.remove",
      targetType: "role",
      targetId: roleId,
      metadata: {
        serverId,
        memberId,
        roleId,
      },
    });
  }
}

export const membershipService = new MembershipService();
