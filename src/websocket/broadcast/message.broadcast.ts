import { WebSocketEvent } from "#websocket/constants/events.js";
import { connectionRegistry } from "#websocket/registry/index.js";

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

  console.log("===== MESSAGE BROADCAST =====");
  console.log("event:", event);
  console.log("channelId:", channelId);
  console.log("connections:", sockets.size);

  const payload = JSON.stringify({
    event,
    data,
  });

  for (const socket of sockets) {
    console.log("socket readyState:", socket.readyState);

    if (socket.readyState === socket.OPEN) {
      console.log("sending:", event);
      socket.send(payload);
    }
  }

  console.log("=============================");
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
