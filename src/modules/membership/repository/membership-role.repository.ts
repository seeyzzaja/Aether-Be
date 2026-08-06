import prisma from "#utils/prisma";

export class MembershipRoleRepository {
  async assign(serverMemberId: string, roleId: string) {
    return prisma.serverMemberRole.create({
      data: {
        serverMemberId,
        roleId,
      },

      include: {
        role: true,
      },
    });
  }

  async remove(serverMemberId: string, roleId: string) {
    return prisma.serverMemberRole.delete({
      where: {
        serverMemberId_roleId: {
          serverMemberId,
          roleId,
        },
      },
    });
  }

  async findMemberRoles(serverMemberId: string) {
    return prisma.serverMemberRole.findMany({
      where: {
        serverMemberId,
      },

      include: {
        role: true,
      },
    });
  }
}
