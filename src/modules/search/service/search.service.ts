import { searchRepository } from "#modules/search/repository/search.repository";
import { ForbiddenError, NotFoundError } from "#shared/errors/app-error";
import { Permission } from "#shared/permissions/permissions";
import { hasPermission } from "#utils/permission";

type SearchType = "all" | "messages" | "servers" | "channels";

export class SearchService {
  async search(
    serverId: string,
    userId: string,
    input: {
      q: string;
      type: SearchType;
      limit: number;
      offset: number;
      channelId?: string;
    },
  ) {
    const server = await searchRepository.findServer(serverId);

    if (!server) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    if (server.ownerId !== userId) {
      const member = await searchRepository.findMember(serverId, userId);

      if (!member) {
        throw new ForbiddenError("Kamu bukan member dari server ini");
      }

      const permissions = member.roles.reduce(
        (
          total: bigint,
          memberRole: {
            role: {
              permissionsBitmask: bigint;
            };
          },
        ) => total | memberRole.role.permissionsBitmask,
        0n,
      );

      if (!hasPermission(permissions, Permission.VIEW_CHANNEL)) {
        throw new ForbiddenError("Kamu tidak memiliki permission VIEW_CHANNEL");
      }
    }

    if (input.channelId) {
      const channel = await searchRepository.findChannel(input.channelId);

      if (!channel) {
        throw new NotFoundError("Channel tidak ditemukan");
      }

      if (channel.serverId !== serverId) {
        throw new ForbiddenError("Channel bukan bagian dari server ini");
      }
    }

    const shouldSearchMessages = input.type === "all" || input.type === "messages";

    const shouldSearchServers = input.type === "all" || input.type === "servers";

    const shouldSearchChannels = input.type === "all" || input.type === "channels";

    const [messages, servers, channels] = await Promise.all([
      shouldSearchMessages
        ? searchRepository.searchMessages(serverId, input.q, {
            ...(input.channelId !== undefined && {
              channelId: input.channelId,
            }),
            limit: input.limit,
            offset: input.offset,
          })
        : [],

      shouldSearchServers ? searchRepository.searchServers(input.q, input.limit, serverId) : [],

      shouldSearchChannels ? searchRepository.searchChannels(input.q, input.limit, serverId) : [],
    ]);

    return {
      messages,
      servers,
      channels,
      type: input.type,
      offset: input.offset,
      limit: input.limit,
    };
  }
}

export const searchService = new SearchService();
