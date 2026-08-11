type RedisWebSocketEvent = {
    event: string;
    data: {
        channelId?: string;
        userId?: string;
        [key: string]: unknown;
    };
};
export declare function broadcastRedisEvent(event: RedisWebSocketEvent): void;
export {};
//# sourceMappingURL=redis.broadcast.d.ts.map