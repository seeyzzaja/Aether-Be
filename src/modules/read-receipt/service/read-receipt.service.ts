import { ForbiddenError, NotFoundError } from "#shared/errors/app-error";
import { publishWebSocketEvent } from "#shared/redis/redis.publisher";
import { WebSocketEvent } from "#websocket/constants/events";

import { readReceiptRepository } from "../repository/read-receipt.repository.js";
import type { UpdateReadReceiptInput } from "../schema/read-receipt.schema.js";

export class ReadReceiptService {
  async update(channelId: string, userId: string, input: UpdateReadReceiptInput) {
    const channel = await readReceiptRepository.findChannel(channelId);

    if (!channel) {
      throw new NotFoundError("Channel tidak ditemukan");
    }

    const message = await readReceiptRepository.findMessage(input.messageId);

    if (!message) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    if (message.isDeleted) {
      throw new NotFoundError("Pesan tidak ditemukan");
    }

    if (message.channelId !== channelId) {
      throw new ForbiddenError("Pesan tidak berada di channel yang dipilih");
    }

    const readState = await readReceiptRepository.upsertReadState(
      userId,
      channelId,
      input.messageId,
    );

    await publishWebSocketEvent({
      event: WebSocketEvent.READ_RECEIPT_UPDATED,
      data: {
        userId,
        channelId,
        messageId: input.messageId,
        readAt: readState.readAt,
      },
    });

    return readState;
  }

  async get(channelId: string, userId: string) {
    const channel = await readReceiptRepository.findChannel(channelId);

    if (!channel) {
      throw new NotFoundError("Channel tidak ditemukan");
    }

    return readReceiptRepository.findReadState(userId, channelId);
  }
}

export const readReceiptService = new ReadReceiptService();
