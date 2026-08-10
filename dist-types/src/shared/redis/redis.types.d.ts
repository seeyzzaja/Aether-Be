export type RedisWebSocketEvent = {
    event: string;
    data: {
        channelId?: string;
        [key: string]: unknown;
    };
};
//# sourceMappingURL=redis.types.d.ts.map