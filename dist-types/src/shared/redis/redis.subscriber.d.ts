import type { RedisClientType } from "redis";
import type { RedisWebSocketEvent } from "#shared/redis/redis.types";
export declare function subscribeWebSocketEvents(onMessage: (message: RedisWebSocketEvent) => void): Promise<RedisClientType>;
//# sourceMappingURL=redis.subscriber.d.ts.map