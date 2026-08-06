import prisma from "#utils/prisma.js";

export class MembershipRepository {
  async findAll() {
    return prisma.server.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async findServerById(serverId: string) {
    return prisma.server.findUnique({
      where: {
        id: serverId,
      },
    });
  }

  async findMember(serverId: string, userId: string) {
    return prisma.serverMember.findUnique({
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
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });
  }

  async findDefaultRole(serverId: string) {
    return prisma.role.findFirst({
      where: {
        serverId,
        isDefault: true,
      },
    });
  }

  async createMember(serverId: string, userId: string, roleId: string) {
    const member = await prisma.serverMember.create({
      data: {
        serverId,
        userId,
      },
      select: {
        id: true,
        serverId: true,
        userId: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });

    await prisma.serverMemberRole.create({
      data: {
        serverMemberId: member.id,
        roleId,
      },
    });

    return {
      ...member,
      roleId,
      role: {
        id: roleId,
      },
    };
  }

  async deleteMember(serverId: string, userId: string) {
    return prisma.serverMember.delete({
      where: {
        serverId_userId: {
          serverId,
          userId,
        },
      },
    });
  }
}

export const membershipRepository = new MembershipRepository();
