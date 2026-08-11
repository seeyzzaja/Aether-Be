import { channelRepository } from "#modules/channel/repository/channel.repository";
import { membershipRepository } from "#modules/membership/repository/membership.repository";
import { publishWebSocketEvent } from "#shared/redis/redis.publisher";
import { WebSocketEvent } from "#websocket/constants/events";

const TYPING_TIMEOUT_MS = 3000;

type TypingState = {
  timer: ReturnType<typeof setTimeout>;
};

export class TypingService {
  private readonly typingStates = new Map<string, TypingState>();

  async start(channelId: string, userId: string): Promise<void> {
    const channel = await channelRepository.findById(channelId);

    if (!channel) {
      throw new Error("Channel tidak ditemukan");
    }

    const member = await membershipRepository.findMember(channel.serverId, userId);

    if (!member) {
      throw new Error("Kamu bukan member dari server ini");
    }

    const key = `${userId}:${channelId}`;
    const existingState = this.typingStates.get(key);

    if (existingState) {
      clearTimeout(existingState.timer);
    } else {
      await publishWebSocketEvent({
        event: WebSocketEvent.TYPING_START,
        data: {
          channelId,
          userId,
        },
      });
    }

    const timer = setTimeout(() => {
      void this.stop(channelId, userId);
    }, TYPING_TIMEOUT_MS);

    this.typingStates.set(key, {
      timer,
    });
  }

  async stop(channelId: string, userId: string): Promise<void> {
    const key = `${userId}:${channelId}`;
    const state = this.typingStates.get(key);

    if (!state) {
      return;
    }

    clearTimeout(state.timer);
    this.typingStates.delete(key);

    await publishWebSocketEvent({
      event: WebSocketEvent.TYPING_STOP,
      data: {
        channelId,
        userId,
      },
    });
  }
}

export const typingService = new TypingService();
