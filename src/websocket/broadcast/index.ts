import { WebSocketEvent } from "#websocket/constants/events.js";
import { connectionRegistry } from "#websocket/registry/index.js";

export {
  broadcastMessageCreated,
  broadcastMessageDeleted,
  broadcastMessageUpdated,
} from "#websocket/broadcast/message.broadcast";

type MessageMentionPayload = {
  messageId: string;
  channelId: string;
  serverId: string;
  authorId: string;
  mentionedUserId: string;
};

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
