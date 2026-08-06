import prisma from "#utils/prisma";

type RoleRecord = {
  id: string;
  serverId: string;
  name: string;
  color: string | null;
  permissionsBitmask: bigint;
  position: number;
  isDefault: boolean;
};

const serializeRole = (role: RoleRecord) => ({
  ...role,
  permissionsBitmask: role.permissionsBitmask.toString(),
});

export class RoleRepository {
  async create(
    serverId: string,
    data: {
      name: string;
      permissionsBitmask: bigint;
    },
  ) {
    const role = await prisma.role.create({
      data: {
        serverId,
        name: data.name,
        permissionsBitmask: data.permissionsBitmask,
      },
      select: {
        id: true,
        serverId: true,
        name: true,
        color: true,
        permissionsBitmask: true,
        position: true,
        isDefault: true,
      },
    });
    return serializeRole(role);
  }

  async findAll(serverId: string) {
    const roles = await prisma.role.findMany({
      where: {
        serverId,
      },

      orderBy: [
        {
          position: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
    return roles.map(serializeRole);
  }

  async findById(roleId: string, serverId: string) {
    const role = await prisma.role.findFirst({
      where: {
        id: roleId,
        serverId,
      },
    });
    return role ? serializeRole(role) : null;
  }

  async update(
    roleId: string,
    serverId: string,
    data: {
      name?: string;
      permissionsBitmask?: bigint;
      color?: string;
    },
  ) {
    const role = await prisma.role.update({
      where: {
        id: roleId,
        serverId,
      },

      data,
    });
    return serializeRole(role);
  }

  async delete(roleId: string, serverId: string) {
    return prisma.role.delete({
      where: {
        id: roleId,
        serverId,
      },
    });
  }
}
