import { Prisma } from "#prisma/generated/prisma/client";
import prisma from "#utils/prisma";

export class MessageRepository {
  async create(data: {
    channelId: string;
    authorId: string;
    content: string;
    replyToId?: string | null;
    threadRootId?: string | null;
    attachments?: Array<{
      fileUrl: string;
      thumbnailUrl?: string | null;
      fileType: string;
      fileSize: number;
      fileName: string;
    }>;
  }) {
    return prisma.message.create({
      data: {
        channelId: data.channelId,
        authorId: data.authorId,
        content: data.content,
        replyToId: data.replyToId ?? null,
        threadRootId: data.threadRootId ?? null,

        ...(data.attachments &&
          data.attachments.length > 0 && {
            attachments: {
              create: data.attachments.map((attachment) => ({
                fileUrl: attachment.fileUrl,
                thumbnailUrl: attachment.thumbnailUrl ?? null,
                fileType: attachment.fileType,
                fileSize: BigInt(attachment.fileSize),
                fileName: attachment.fileName,
              })),
            },
          }),
      },

      include: {
        attachments: true,
      },
    });
  }

  async findById(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });
  }

  async findByIdWithChannel(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        channel: true,
      },
    });
  }

  async findReplyTarget(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
      select: {
        id: true,
        channelId: true,
        authorId: true,
        content: true,
        isDeleted: true,
      },
    });
  }

  async update(
    messageId: string,
    data: {
      content?: string;
      isPinned?: boolean;
    },
  ) {
    return prisma.message.update({
      where: {
        id: messageId,
      },
      data,
    });
  }

  async softDelete(messageId: string) {
    return prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async findByChannelId(
    channelId: string,
    options?: {
      limit?: number;
      cursor?: string;
    },
  ) {
    const limit = options?.limit ?? 50;

    return prisma.message.findMany({
      where: {
        channelId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      ...(options?.cursor && {
        cursor: {
          id: options.cursor,
        },
        skip: 1,
      }),
      include: {
        attachments: true,
      },
    });
  }

  async findServerContext(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
      select: {
        id: true,
        channelId: true,
        authorId: true,
        content: true,
        isPinned: true,
        isDeleted: true,
        channel: {
          select: {
            id: true,
            serverId: true,
          },
        },
      },
    });
  }

  async findMemberPermissions(serverId: string, userId: string) {
    return prisma.serverMember.findUnique({
      where: {
        serverId_userId: {
          serverId,
          userId,
        },
      },
      select: {
        roles: {
          select: {
            role: {
              select: {
                permissionsBitmask: true,
              },
            },
          },
        },
      },
    });
  }

  async findChannelPermissions(channelId: string, serverId: string, userId: string) {
    const member = await prisma.serverMember.findUnique({
      where: {
        serverId_userId: {
          serverId,
          userId,
        },
      },
      select: {
        roles: {
          select: {
            roleId: true,
            role: {
              select: {
                permissionsBitmask: true,
              },
            },
          },
        },
      },
    });

    if (!member) {
      return null;
    }

    const defaultRole = await prisma.role.findFirst({
      where: {
        serverId,
        isDefault: true,
      },
      select: {
        id: true,
        permissionsBitmask: true,
      },
    });

    const roleIds = [
      ...(defaultRole ? [defaultRole.id] : []),
      ...member.roles.map((memberRole) => memberRole.roleId),
    ];

    const overrides = await prisma.channelPermissionOverride.findMany({
      where: {
        channelId,
        roleId: {
          in: roleIds,
        },
      },
      select: {
        roleId: true,
        allowBitmask: true,
        denyBitmask: true,
      },
    });

    let permissions = defaultRole?.permissionsBitmask ?? 0n;

    for (const memberRole of member.roles) {
      permissions |= memberRole.role.permissionsBitmask;
    }

    const everyoneOverride = defaultRole
      ? overrides.find((override) => override.roleId === defaultRole.id)
      : undefined;

    if (everyoneOverride) {
      permissions &= ~everyoneOverride.denyBitmask;
      permissions |= everyoneOverride.allowBitmask;
    }

    const roleOverrides = overrides.filter((override) => override.roleId !== defaultRole?.id);

    let roleDeny = 0n;
    let roleAllow = 0n;

    for (const override of roleOverrides) {
      roleDeny |= override.denyBitmask;
      roleAllow |= override.allowBitmask;
    }

    permissions &= ~roleDeny;
    permissions |= roleAllow;

    return permissions;
  }

  async findServerOwner(serverId: string) {
    return prisma.server.findUnique({
      where: {
        id: serverId,
      },
      select: {
        ownerId: true,
      },
    });
  }

  async findChannelById(channelId: string) {
    return prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        id: true,
        serverId: true,
        type: true,
      },
    });
  }

  async search(
    serverId: string,
    query: string,
    options?: {
      channelId?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    const limit = options?.limit ?? 20;
    const offset = options?.offset ?? 0;

    const channelFilter = options?.channelId
      ? Prisma.sql`AND m."channelId" = ${options.channelId}`
      : Prisma.empty;

    return prisma.$queryRaw<
      Array<{
        id: string;
        channelId: string;
        authorId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        rank: number;
      }>
    >`
    SELECT
      m."id",
      m."channelId",
      m."authorId",
      m."content",
      m."createdAt",
      m."updatedAt",
      ts_rank(
        m."search_vector",
        websearch_to_tsquery('indonesian', ${query})
      ) AS "rank"
    FROM "messages" m
    INNER JOIN "channels" c
      ON c."id" = m."channelId"
    WHERE c."serverId" = ${serverId}
      AND m."isDeleted" = false
      AND m."search_vector" @@ websearch_to_tsquery(
        'indonesian',
        ${query}
      )
      ${channelFilter}
    ORDER BY "rank" DESC, m."createdAt" DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
  }
  async searchByChannel(
    channelId: string,
    query: string,
    options?: {
      limit?: number;
      offset?: number;
    },
  ) {
    const limit = options?.limit ?? 20;
    const offset = options?.offset ?? 0;

    return prisma.$queryRaw<
      Array<{
        id: string;
        channelId: string;
        authorId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        rank: number;
      }>
    >`
    SELECT
      m."id",
      m."channelId",
      m."authorId",
      m."content",
      m."createdAt",
      m."updatedAt",
      ts_rank(
        m."search_vector",
        websearch_to_tsquery('indonesian', ${query})
      ) AS "rank"
    FROM "messages" m
    WHERE m."channelId" = ${channelId}
      AND m."isDeleted" = false
      AND m."search_vector" @@ websearch_to_tsquery(
        'indonesian',
        ${query}
      )
    ORDER BY "rank" DESC, m."createdAt" DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
  }

  async countSearchByChannel(channelId: string, query: string) {
    const result = await prisma.$queryRaw<
      Array<{
        count: bigint;
      }>
    >`
    SELECT COUNT(*) AS count
    FROM "messages" m
    WHERE m."channelId" = ${channelId}
      AND m."isDeleted" = false
      AND m."search_vector" @@ websearch_to_tsquery(
        'indonesian',
        ${query}
      )
  `;

    return Number(result[0]?.count ?? 0n);
  }
  async countSearch(serverId: string, query: string, channelId?: string) {
    const channelFilter = channelId ? Prisma.sql`AND m."channelId" = ${channelId}` : Prisma.empty;

    const result = await prisma.$queryRaw<
      Array<{
        count: bigint;
      }>
    >`
    SELECT COUNT(*) AS count
    FROM "messages" m
    INNER JOIN "channels" c
      ON c."id" = m."channelId"
    WHERE c."serverId" = ${serverId}
      AND m."isDeleted" = false
      AND m."search_vector" @@ websearch_to_tsquery(
        'indonesian',
        ${query}
      )
      ${channelFilter}
  `;

    return Number(result[0]?.count ?? 0n);
  }
  async findServerMember(serverId: string, userId: string) {
    return prisma.serverMember.findUnique({
      where: {
        serverId_userId: {
          serverId,
          userId,
        },
      },
      select: {
        userId: true,
      },
    });
  }
  async findThreadMessages(threadRootId: string) {
    return prisma.message.findMany({
      where: {
        threadRootId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        attachments: true,
      },
    });
  }
  async findForwardSource(messageId: string) {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
      select: {
        id: true,
        channelId: true,
        authorId: true,
        content: true,
        isDeleted: true,
        channel: {
          select: {
            id: true,
            serverId: true,
          },
        },
        attachments: {
          select: {
            fileUrl: true,
            thumbnailUrl: true,
            fileType: true,
            fileSize: true,
            fileName: true,
          },
        },
      },
    });
  }

  async findUserTrustProfile(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        createdAt: true,
        emailVerifiedAt: true,
      },
    });
  }
  async findDmParticipant(channelId: string, userId: string) {
    return prisma.dmParticipant.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
      select: {
        channelId: true,
        userId: true,
        status: true,
      },
    });
  }

  async findDmParticipants(channelId: string) {
    return prisma.dmParticipant.findMany({
      where: {
        channelId,
      },
      select: {
        channelId: true,
        userId: true,
      },
    });
  }
}

export const messageRepository = new MessageRepository();
