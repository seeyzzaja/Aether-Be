import { connectRedis, redisClient } from "#shared/redis/redis.client";

const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_LOCK_SECONDS = 15 * 60;

const getAttemptKey = (ipAddress: string | null, email: string) =>
  `auth:login-attempt:${ipAddress ?? "unknown"}:${email.toLowerCase()}`;

const getLockKey = (ipAddress: string | null, email: string) =>
  `auth:login-lock:${ipAddress ?? "unknown"}:${email.toLowerCase()}`;

export class LoginAttemptService {
  async isLocked(ipAddress: string | null, email: string) {
    await connectRedis();

    const key = getLockKey(ipAddress, email);

    return (await redisClient.exists(key)) === 1;
  }

  async recordFailure(ipAddress: string | null, email: string) {
    await connectRedis();

    const attemptKey = getAttemptKey(ipAddress, email);
    const lockKey = getLockKey(ipAddress, email);

    const attempts = await redisClient.incr(attemptKey);

    await redisClient.expire(attemptKey, LOGIN_LOCK_SECONDS);

    if (attempts >= LOGIN_ATTEMPT_LIMIT) {
      await redisClient.set(lockKey, "1", {
        EX: LOGIN_LOCK_SECONDS,
      });

      await redisClient.del(attemptKey);

      return {
        locked: true,
        attempts,
      };
    }

    return {
      locked: false,
      attempts,
    };
  }

  async clearFailures(ipAddress: string | null, email: string) {
    await connectRedis();

    const attemptKey = getAttemptKey(ipAddress, email);

    await redisClient.del(attemptKey);
  }
}

export const loginAttemptService = new LoginAttemptService();
