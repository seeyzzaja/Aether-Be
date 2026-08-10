import type { RedisWebSocketEvent } from "#shared/redis/redis.types";
export declare function subscribeWebSocketEvents(onMessage: (message: RedisWebSocketEvent) => void): Promise<void>;
//# sourceMappingURL=redis.subscriber.d.ts.map