import { ConflictError, ForbiddenError, NotFoundError } from "#shared/errors/app-error.js";

import { membershipRepository } from "../repository/membership.repository.js";

export class MembershipService {
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

    return membershipRepository.createMember(serverId, userId, defaultRole.id);
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
  }
}

export const membershipService = new MembershipService();
