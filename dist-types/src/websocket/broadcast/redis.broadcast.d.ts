type RedisWebSocketEvent = {
    event: string;
    data: {
        channelId?: string;
        userId?: string;
        status?: string;
    };
};
export declare function broadcastRedisEvent(event: RedisWebSocketEvent): void;
export {};
//# sourceMappingURL=redis.broadcast.d.ts.map