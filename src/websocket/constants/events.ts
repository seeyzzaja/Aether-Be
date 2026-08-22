export const WebSocketEvent = {
  CONNECTED: "connected",

  PING: "ping",
  PONG: "pong",

  SUBSCRIBE: "subscribe",
  SUBSCRIBED: "subscribed",

  UNSUBSCRIBE: "unsubscribe",
  UNSUBSCRIBED: "unsubscribed",

  MESSAGE_CREATED: "message.created",
  MESSAGE_UPDATED: "message.updated",
  MESSAGE_DELETED: "message.deleted",

  MESSAGE_MENTION: "message.mention",

  REACTION_ADDED: "reaction.added",
  REACTION_REMOVED: "reaction.removed",

  TYPING_START: "typing.start",
  TYPING_STOP: "typing.stop",

  READ_RECEIPT_UPDATED: "read.receipt.updated",

  NOTIFICATION_CREATED: "notification.created",

  POLL_CREATED: "poll.created",
  POLL_VOTE_UPDATED: "poll.vote.updated",

  ERROR: "error",

  GROUP_DM_UPDATED: "group_dm.updated",
  GROUP_DM_PARTICIPANT_ADDED: "group_dm.participant_added",
  GROUP_DM_PARTICIPANT_REMOVED: "group_dm.participant_removed",
} as const;

export type WebSocketEventType = (typeof WebSocketEvent)[keyof typeof WebSocketEvent];
