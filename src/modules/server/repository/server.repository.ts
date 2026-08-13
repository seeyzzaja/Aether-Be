import type { CreateServerInput, UpdateServerInput } from "#modules/server/schema/server.schema";
import type { TransactionClient } from "#prisma/generated/prisma/internal/prismaNamespace";
import prisma from "#utils/prisma";

export class ServerRepository {
  async create(ownerId: string, data: CreateServerInput) {
    return prisma.$transaction(async (tx: TransactionClient) => {
      const server = await tx.server.create({
        data: {
          ownerId,
          name: data.name,
          ...(data.iconUrl !== undefined && {
            iconUrl: data.iconUrl,
          }),
        },
      });

      const everyoneRole = await tx.role.create({
        data: {
          serverId: server.id,
          name: "@everyone",
          permissionsBitmask: BigInt(0),
          position: 0,
          isDefault: true,
        },
      });

      const ownerRole = await tx.role.create({
        data: {
          serverId: server.id,
          name: "Owner",
          permissionsBitmask: BigInt(8192),
          position: 1,
          isDefault: false,
        },
      });
      const member = await tx.serverMember.create({
        data: {
          serverId: server.id,
          userId: ownerId,
        },
      });

      await tx.serverMemberRole.createMany({
        data: [
          {
            serverMemberId: member.id,
            roleId: everyoneRole.id,
          },
          {
            serverMemberId: member.id,
            roleId: ownerRole.id,
          },
        ],
      });

      return server;
    });
  }

  async findAllByOwnerId(ownerId: string) {
    return prisma.server.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async findAll() {
    return prisma.server.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async findById(serverId: string) {
    return prisma.server.findUnique({
      where: {
        id: serverId,
      },
    });
  }

  async update(serverId: string, data: UpdateServerInput) {
    return prisma.server.update({
      where: {
        id: serverId,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.iconUrl !== undefined && {
          iconUrl: data.iconUrl,
        }),
      },
    });
  }

  async delete(serverId: string) {
    return prisma.server.delete({
      where: {
        id: serverId,
      },
    });
  }
}

export const serverRepository = new ServerRepository();
