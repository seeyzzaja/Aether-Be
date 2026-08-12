import prisma from "#utils/prisma";

export class SearchRepository {
  async findServer(serverId: string) {
    return prisma.server.findUnique({
      where: {
        id: serverId,
      },
      select: {
        id: true,
        ownerId: true,
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

  async findChannel(channelId: string) {
    return prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        id: true,
        serverId: true,
      },
    });
  }

  async searchMessages(
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

    if (options?.channelId) {
      return prisma.$queryRaw<
        Array<{
          id: string;
          channelId: string;
          authorId: string;
          content: string;
          createdAt: Date;
          rank: number;
        }>
      >`
      SELECT
        m."id",
        m."channelId",
        m."authorId",
        m."content",
        m."createdAt",
        ts_rank(
          m."search_vector",
          websearch_to_tsquery('indonesian', ${query})
        ) AS "rank"
      FROM "messages" m
      INNER JOIN "channels" c
        ON c."id" = m."channelId"
      WHERE c."serverId" = ${serverId}
        AND m."channelId" = ${options.channelId}
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

    return prisma.$queryRaw<
      Array<{
        id: string;
        channelId: string;
        authorId: string;
        content: string;
        createdAt: Date;
        rank: number;
      }>
    >`
    SELECT
      m."id",
      m."channelId",
      m."authorId",
      m."content",
      m."createdAt",
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
    ORDER BY "rank" DESC, m."createdAt" DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
  }

  async searchServers(query: string, limit = 20, serverId?: string) {
    if (!serverId) {
      return [];
    }

    return prisma.$queryRaw<
      Array<{
        id: string;
        name: string;
        ownerId: string;
        rank: number;
      }>
    >`
      SELECT
        s."id",
        s."name",
        s."ownerId",
        ts_rank(
          s."search_vector",
          websearch_to_tsquery('indonesian', ${query})
        ) AS "rank"
      FROM "Server" s
      INNER JOIN "ServerMember" sm
        ON sm."serverId" = s."id"
      WHERE
        s."id" = ${serverId}
        AND s."search_vector" @@ websearch_to_tsquery(
          'indonesian',
          ${query}
        )
      ORDER BY "rank" DESC, s."name" ASC
      LIMIT ${limit}
    `;
  }

  async searchChannels(query: string, limit = 20, serverId?: string) {
    if (!serverId) {
      return [];
    }

    return prisma.$queryRaw<
      Array<{
        id: string;
        serverId: string;
        name: string;
        topic: string | null;
        rank: number;
      }>
    >`
      SELECT
        c."id",
        c."serverId",
        c."name",
        c."topic",
        ts_rank(
          c."search_vector",
          websearch_to_tsquery('indonesian', ${query})
        ) AS "rank"
      FROM "channels" c
      WHERE
        c."serverId" = ${serverId}
        AND c."search_vector" @@ websearch_to_tsquery(
          'indonesian',
          ${query}
        )
      ORDER BY "rank" DESC, c."name" ASC
      LIMIT ${limit}
    `;
  }
}

export const searchRepository = new SearchRepository();
