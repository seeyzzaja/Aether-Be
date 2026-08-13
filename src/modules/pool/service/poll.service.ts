import { ForbiddenError, NotFoundError } from "#shared/errors/app-error";
import { Permission } from "#shared/permissions/permissions";
import { publishWebSocketEvent } from "#shared/redis/redis.publisher";
import { hasPermission } from "#utils/permission";
import { WebSocketEvent } from "#websocket/constants/events";
import { pollRepository } from "../repository/poll.repository.js";
import type { CreatePollInput, SubmitVoteInput } from "../schema/poll.schema.js";

export class PollService {
  private async getActorPermissions(serverId: string, userId: string): Promise<bigint> {
    const serverOwner = await this.getServerOwner(serverId);

    if (!serverOwner) {
      throw new NotFoundError("Server tidak ditemukan");
    }

    if (serverOwner.ownerId === userId) {
      return Permission.ADMINISTRATOR;
    }

    const member = await this.getMemberPermissions(serverId, userId);

    if (!member) {
      throw new ForbiddenError("Kamu bukan member dari server ini");
    }

    return member.roles.reduce(
      (total, memberRole) => total | memberRole.role.permissionsBitmask,
      0n,
    );
  }

  private async ensurePermission(
    serverId: string,
    channelId: string,
    userId: string,
    permission: bigint,
  ) {
    const serverPermissions = await this.getActorPermissions(serverId, userId);

    if (hasPermission(serverPermissions, Permission.ADMINISTRATOR)) {
      return;
    }

    const channelPermissions = await this.getChannelPermissions(channelId, serverId, userId);

    if (channelPermissions === null) {
      throw new ForbiddenError("Kamu bukan member dari server ini");
    }

    if (!hasPermission(channelPermissions, permission)) {
      throw new ForbiddenError("Kamu tidak memiliki permission yang diperlukan");
    }
  }

  async create(messageId: string, userId: string, input: CreatePollInput) {
    const message = await pollRepository.findMessageContext(messageId);

    if (!message) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    if (message.isDeleted) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    if (message.poll) {
      throw new ForbiddenError("Pesan ini sudah memiliki poll");
    }

    await this.ensurePermission(
      message.channel.serverId,
      message.channelId,
      userId,
      Permission.SEND_MESSAGES,
    );

    const expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;

    if (expiresAt && expiresAt <= new Date()) {
      throw new ForbiddenError("Waktu berakhir poll harus berada di masa depan");
    }

    const poll = await pollRepository.createPoll(messageId, {
      question: input.question,
      allowMultipleChoice: input.allowMultipleChoice,
      expiresAt,
      options: input.options,
    });

    await publishWebSocketEvent({
      event: WebSocketEvent.POLL_CREATED,
      data: poll,
    });

    return poll;
  }

  async vote(pollId: string, userId: string, input: SubmitVoteInput) {
    const poll = await pollRepository.findPollContext(pollId);

    if (!poll) {
      throw new NotFoundError("Poll tidak ditemukan");
    }

    if (poll.message.isDeleted) {
      throw new NotFoundError("Poll tidak ditemukan");
    }

    await this.ensurePermission(
      poll.message.channel.serverId,
      poll.message.channelId,
      userId,
      Permission.VIEW_CHANNEL,
    );

    if (poll.expiresAt && poll.expiresAt <= new Date()) {
      throw new ForbiddenError("Poll sudah ditutup");
    }

    const uniqueOptionIds = [...new Set(input.optionIds)];

    if (!poll.allowMultipleChoice && uniqueOptionIds.length > 1) {
      throw new ForbiddenError("Poll single-choice hanya menerima satu opsi");
    }

    const pollOptionIds = new Set(poll.options.map((option) => option.id));

    const invalidOptionIds = uniqueOptionIds.filter((optionId) => !pollOptionIds.has(optionId));

    if (invalidOptionIds.length > 0) {
      throw new NotFoundError("Salah satu opsi poll tidak ditemukan");
    }

    const existingVotes = await pollRepository.findVotesForUser(pollId, userId);

    const existingOptionIds = new Set(existingVotes.map((vote) => vote.pollOptionId));

    const duplicateVote = uniqueOptionIds.some((optionId) => existingOptionIds.has(optionId));

    if (duplicateVote) {
      throw new ForbiddenError("Kamu sudah memilih salah satu opsi tersebut");
    }

    if (!poll.allowMultipleChoice && existingVotes.length > 0) {
      throw new ForbiddenError("Poll single-choice hanya mengizinkan satu vote per user");
    }

    try {
      await pollRepository.submitVotes(pollId, userId, uniqueOptionIds);
    } catch (error) {
      if (error instanceof Error && error.message === "DUPLICATE_POLL_VOTE") {
        throw new ForbiddenError("Kamu sudah memilih salah satu opsi tersebut");
      }

      throw error;
    }

    const result = await pollRepository.getPollResults(pollId, userId);

    if (!result) {
      throw new NotFoundError("Poll tidak ditemukan");
    }

    await publishWebSocketEvent({
      event: WebSocketEvent.POLL_VOTE_UPDATED,
      data: result,
    });

    return result;
  }

  private async getServerOwner(serverId: string) {
    return import("#utils/prisma").then(({ default: prisma }) =>
      prisma.server.findUnique({
        where: {
          id: serverId,
        },
        select: {
          ownerId: true,
        },
      }),
    );
  }

  private async getMemberPermissions(serverId: string, userId: string) {
    return import("#utils/prisma").then(({ default: prisma }) =>
      prisma.serverMember.findUnique({
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
      }),
    );
  }

  private async getChannelPermissions(channelId: string, serverId: string, userId: string) {
    return import("#utils/prisma")
      .then(({ default: prisma }) =>
        prisma.channelPermissionOverride.findMany({
          where: {
            channelId,
            role: {
              serverId,
            },
          },
          select: {
            roleId: true,
            allowBitmask: true,
            denyBitmask: true,
          },
        }),
      )
      .then(async (overrides) => {
        const prisma = (await import("#utils/prisma")).default;

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

        let permissions = defaultRole?.permissionsBitmask ?? 0n;

        for (const memberRole of member.roles) {
          permissions |= memberRole.role.permissionsBitmask;
        }

        const roleIds = [
          ...(defaultRole ? [defaultRole.id] : []),
          ...member.roles.map((role) => role.roleId),
        ];

        const relevantOverrides = overrides.filter((override) => roleIds.includes(override.roleId));

        const everyoneOverride = defaultRole
          ? relevantOverrides.find((override) => override.roleId === defaultRole.id)
          : undefined;

        if (everyoneOverride) {
          permissions &= ~everyoneOverride.denyBitmask;
          permissions |= everyoneOverride.allowBitmask;
        }

        let roleDeny = 0n;
        let roleAllow = 0n;

        for (const override of relevantOverrides) {
          if (override.roleId === defaultRole?.id) {
            continue;
          }

          roleDeny |= override.denyBitmask;
          roleAllow |= override.allowBitmask;
        }

        permissions &= ~roleDeny;
        permissions |= roleAllow;

        return permissions;
      });
  }
}

export const pollService = new PollService();
