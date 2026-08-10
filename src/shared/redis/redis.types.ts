export type RedisWebSocketEvent = {
  event: string;
  data: {
    channelId?: string;
    [key: string]: unknown;
  };
};
