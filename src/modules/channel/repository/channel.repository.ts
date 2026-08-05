import type {
  CreateChannelInput,
  UpdateChannelInput,
} from "#modules/channel/schema/channel.schema";
import prisma from "#utils/prisma";

export class ChannelRepository {
  async findServerById(serverId: string) {
    return prisma.server.findUnique({
      where: {
        id: serverId,
      },
    });
  }

  async findCategoryById(categoryId: string) {
    return prisma.category.findUnique({
      where: {
        id: categoryId,
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
    });
  }
  async getNextPosition(serverId: string, categoryId?: string | null) {
    const lastChannel = await prisma.channel.findFirst({
      where: {
        serverId,
        categoryId: categoryId ?? null,
      },
      orderBy: {
        position: "desc",
      },
      select: {
        position: true,
      },
    });

    return lastChannel ? lastChannel.position + 1 : 0;
  }

  async create(serverId: string, data: CreateChannelInput, position: number) {
    return prisma.channel.create({
      data: {
        serverId,
        categoryId: data.categoryId ?? null,
        name: data.name,
        type: data.type,
        ...(data.topic !== undefined && {
          topic: data.topic,
        }),
        position,
      },
    });
  }

  async findAllByServerId(serverId: string) {
    return prisma.channel.findMany({
      where: {
        serverId,
      },
      orderBy: [
        {
          categoryId: "asc",
        },
        {
          position: "asc",
        },
      ],
    });
  }

  async findById(channelId: string) {
    return prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
  }

  async update(channelId: string, data: UpdateChannelInput) {
    return prisma.channel.update({
      where: {
        id: channelId,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.type !== undefined && {
          type: data.type,
        }),
        ...(data.topic !== undefined && {
          topic: data.topic,
        }),
        ...(data.categoryId !== undefined && {
          categoryId: data.categoryId,
        }),
      },
    });
  }

  async delete(channelId: string) {
    return prisma.channel.delete({
      where: {
        id: channelId,
      },
    });
  }
}

export const channelRepository = new ChannelRepository();
