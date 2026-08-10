import { WebSocketEvent } from "#websocket/constants/events";
import { connectionRegistry } from "#websocket/registry/index";

export {
  broadcastMessageCreated,
  broadcastMessageDeleted,
  broadcastMessageUpdated,
} from "#websocket/broadcast/message.broadcast";
export * from "./reaction.broadcast.js";
export { broadcastRedisEvent } from "./redis.broadcast.js";

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
