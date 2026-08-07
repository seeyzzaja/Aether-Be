export const WebSocketEvent = {
  CONNECTED: "connected",

  PING: "ping",
  PONG: "pong",

  SUBSCRIBE: "subscribe",
  SUBSCRIBED: "subscribed",

  UNSUBSCRIBE: "unsubscribe",
  UNSUBSCRIBED: "unsubscribed",

  ERROR: "error",
} as const;

export type WebSocketEventType = (typeof WebSocketEvent)[keyof typeof WebSocketEvent];
