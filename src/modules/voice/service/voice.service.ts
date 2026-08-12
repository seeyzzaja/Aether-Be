import { AccessToken } from "livekit-server-sdk";
import config from "#config/env";
import { channelRepository } from "#modules/channel/repository/channel.repository";
import { ForbiddenError, NotFoundError } from "#shared/errors/app-error";
import { Permission } from "#shared/permissions/permissions";
import { hasPermission } from "#utils/permission";
import prisma from "#utils/prisma";

export class VoiceService {
  private async getActorPermissions(serverId: string, userId: string): Promise<bigint> {
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
      throw new ForbiddenError("Kamu bukan anggota server");
    }

    return member.roles.reduce(
      (total: bigint, memberRole: { role: { permissionsBitmask: bigint } }) =>
        total | memberRole.role.permissionsBitmask,
      0n,
    );
  }

  async createVoiceToken(channelId: string, userId: string, withVideo: boolean) {
    const channel = await channelRepository.findById(channelId);

    if (!channel) {
      throw new NotFoundError("Channel tidak ditemukan");
    }

    const permissions = await this.getActorPermissions(channel.serverId, userId);

    if (!hasPermission(permissions, Permission.CONNECT)) {
      throw new ForbiddenError("Kamu tidak memiliki permission CONNECT");
    }

    const roomName = `channel_${channelId}`;

    const accessToken = new AccessToken(config.LIVEKIT_API_KEY, config.LIVEKIT_API_SECRET, {
      identity: userId,
    });

    accessToken.addGrant({
      roomJoin: true,
      room: roomName,
      canSubscribe: true,
      canPublish: true,
      canPublishData: true,
    });

    void withVideo;

    const token = await accessToken.toJwt();

    return {
      livekitUrl: config.LIVEKIT_URL,
      token,
      roomName,
    };
  }
}

export const voiceService = new VoiceService();
