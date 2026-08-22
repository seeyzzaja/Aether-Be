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

  private async createLiveKitToken(roomName: string, userId: string, withVideo: boolean) {
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

  async createVoiceToken(channelId: string, userId: string, withVideo: boolean) {
    const channel = await channelRepository.findById(channelId);

    if (!channel) {
      throw new NotFoundError("Channel tidak ditemukan");
    }

    if (!channel.serverId) {
      throw new ForbiddenError("Voice channel harus berada di dalam server");
    }

    const permissions = await this.getActorPermissions(channel.serverId, userId);

    if (!hasPermission(permissions, Permission.CONNECT)) {
      throw new ForbiddenError("Kamu tidak memiliki permission CONNECT");
    }

    const roomName = `channel_${channelId}`;

    return this.createLiveKitToken(roomName, userId, withVideo);
  }

  async createDmVoiceToken(channelId: string, userId: string, withVideo: boolean) {
    const channel = await prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        id: true,
        type: true,
        serverId: true,
      },
    });

    if (!channel) {
      throw new NotFoundError("Conversation DM tidak ditemukan");
    }

    if (channel.type !== "DM" && channel.type !== "GROUP_DM") {
      throw new ForbiddenError("Channel bukan DM atau Group DM");
    }

    if (channel.serverId !== null) {
      throw new ForbiddenError("DM tidak boleh berada di dalam server");
    }

    const participant = await prisma.dmParticipant.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
      select: {
        status: true,
      },
    });

    if (!participant || participant.status !== "accepted") {
      throw new ForbiddenError("Kamu bukan participant aktif pada DM ini");
    }

    const roomName = `dm_${channelId}`;

    return this.createLiveKitToken(roomName, userId, withVideo);
  }
}

export const voiceService = new VoiceService();
