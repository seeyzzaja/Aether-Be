import { logger } from "#shared/logger/logger";
import { WebSocketEvent } from "#websocket/constants/events";
import { connectionRegistry } from "#websocket/registry/index";

type MessageBroadcastPayload = {
  id: string;
  channelId: string;
  authorId: string;
  replyToId: string | null;
  threadRootId: string | null;
  content: string;
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

type MessageMentionPayload = {
  messageId: string;
  channelId: string;
  serverId: string;
  authorId: string;
  mentionedUserId: string;
};

function broadcastToChannel(channelId: string, event: string, data: MessageBroadcastPayload): void {
  const sockets = connectionRegistry.getConnections(channelId);

  logger.debug(
    {
      event,
      channelId,
      connections: sockets.size,
    },
    "Broadcasting message event to channel",
  );

  const payload = JSON.stringify({
    event,
    data,
  });

  for (const socket of sockets) {
    logger.debug(
      {
        event,
        channelId,
        readyState: socket.readyState,
      },
      "Checking WebSocket connection",
    );

    if (socket.readyState === socket.OPEN) {
      logger.debug(
        {
          event,
          channelId,
        },
        "Sending WebSocket event",
      );

      socket.send(payload);
    }
  }
}

export function broadcastMessageCreated(message: MessageBroadcastPayload): void {
  broadcastToChannel(message.channelId, WebSocketEvent.MESSAGE_CREATED, message);
}

export function broadcastMessageUpdated(message: MessageBroadcastPayload): void {
  broadcastToChannel(message.channelId, WebSocketEvent.MESSAGE_UPDATED, message);
}

export function broadcastMessageDeleted(message: MessageBroadcastPayload): void {
  broadcastToChannel(message.channelId, WebSocketEvent.MESSAGE_DELETED, message);
}

export function broadcastMessageMention(payload: MessageMentionPayload): void {
  const sockets = connectionRegistry.getConnections(payload.channelId);

  const message = JSON.stringify({
    event: WebSocketEvent.MESSAGE_MENTION,
    data: payload,
  });

  for (const socket of sockets) {
    if (socket.readyState === socket.OPEN) {
      socket.send(message);
    }
  }
}
