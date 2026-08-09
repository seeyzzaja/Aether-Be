import { WebSocketEvent } from "#websocket/constants/events.js";
import { connectionRegistry } from "#websocket/registry/index.js";

export type ReactionBroadcastPayload = {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
};

function broadcastToChannel(
  channelId: string,
  event: string,
  data: ReactionBroadcastPayload,
): void {
  const sockets = connectionRegistry.getConnections(channelId);

  const payload = JSON.stringify({
    event,
    data,
  });

  for (const socket of sockets) {
    if (socket.readyState === socket.OPEN) {
      socket.send(payload);
    }
  }
}

export function broadcastReactionAdded(
  channelId: string,
  reaction: ReactionBroadcastPayload,
): void {
  broadcastToChannel(channelId, WebSocketEvent.REACTION_ADDED, reaction);
}

export function broadcastReactionRemoved(
  channelId: string,
  reaction: ReactionBroadcastPayload,
): void {
  broadcastToChannel(channelId, WebSocketEvent.REACTION_REMOVED, reaction);
}
