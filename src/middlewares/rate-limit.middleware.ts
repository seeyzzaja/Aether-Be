import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

import { connectRedis, redisClient } from "#shared/redis/redis.client";

type RateLimitOptions = {
  windowSeconds: number;
  maxRequests: number;
  keyPrefix?: string;
  keyGenerator?: (req: Request) => string;
};

export function rateLimit(options: RateLimitOptions) {
  const { windowSeconds, maxRequests, keyPrefix = "rate-limit", keyGenerator } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await connectRedis();

      const identifier = keyGenerator?.(req) ?? req.ip ?? req.socket.remoteAddress ?? "unknown";

      const key = `${keyPrefix}:${identifier}`;

      const now = Date.now();
      const windowStart = now - windowSeconds * 1000;
      const member = `${now}:${randomUUID()}`;

      const pipeline = redisClient.multi();

      pipeline.zRemRangeByScore(key, 0, windowStart);
      pipeline.zAdd(key, {
        score: now,
        value: member,
      });
      pipeline.zCard(key);
      pipeline.expire(key, windowSeconds);

      const results = await pipeline.exec();

      const currentCount = Number(results?.[2] ?? 0);

      const oldestEntry = await redisClient.zRangeWithScores(key, 0, 0);

      let resetAt = now + windowSeconds * 1000;

      const oldest = oldestEntry[0];

      if (oldest) {
        resetAt = oldest.score + windowSeconds * 1000;
      }

      const retryAfter = Math.max(Math.ceil((resetAt - now) / 1000), 1);

      const remaining = Math.max(maxRequests - currentCount, 0);

      res.setHeader("X-RateLimit-Limit", maxRequests.toString());
      res.setHeader("X-RateLimit-Remaining", remaining.toString());
      res.setHeader("X-RateLimit-Reset", Math.ceil(resetAt / 1000).toString());

      if (currentCount > maxRequests) {
        res.setHeader("Retry-After", retryAfter.toString());

        // Hapus entry yang baru saja ditambahkan karena request ini
        // ditolak dan tidak boleh ikut menghitung quota berikutnya.
        await redisClient.zRem(key, member);

        return res.status(429).json({
          success: false,
          code: "RATE_LIMITED",
          message: "Terlalu banyak request. Silakan coba lagi nanti.",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
