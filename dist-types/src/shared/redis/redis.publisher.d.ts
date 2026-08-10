import type { RedisWebSocketEvent } from "#shared/redis/redis.types";
export declare const REDIS_CHANNEL = "aether:websocket";
export declare function publishWebSocketEvent(data: RedisWebSocketEvent): Promise<void>;
//# sourceMappingURL=redis.publisher.d.ts.map