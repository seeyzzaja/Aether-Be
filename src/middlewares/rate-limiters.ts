import { rateLimit } from "#middlewares/rate-limit.middleware";

export const registerRateLimiter = rateLimit({
  windowSeconds: 15 * 60,
  maxRequests: 5,
  keyPrefix: "rate-limit:auth:register",
});

export const loginRateLimiter = rateLimit({
  windowSeconds: 60,
  maxRequests: 5,
  keyPrefix: "rate-limit:auth:login",
  keyGenerator: (req) => {
    const email = String(req.body?.email ?? "unknown")
      .trim()
      .toLowerCase();

    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";

    return `${ip}:${email}`;
  },
});

export const messageRateLimiter = rateLimit({
  windowSeconds: 10,
  maxRequests: 10,
  keyPrefix: "rate-limit:message",
  keyGenerator: (req) => {
    const userId = req.user?.userId ?? "anonymous";
    const channelId = req.params.channelId ?? "unknown";

    return `${userId}:${channelId}`;
  },
});

export const uploadRateLimiter = rateLimit({
  windowSeconds: 60,
  maxRequests: 20,
  keyPrefix: "rate-limit:upload",
  keyGenerator: (req) => {
    return req.user?.userId ?? "anonymous";
  },
});

export const searchRateLimiter = rateLimit({
  windowSeconds: 60,
  maxRequests: 30,
  keyPrefix: "rate-limit:search",
  keyGenerator: (req) => {
    return req.user?.userId ?? "anonymous";
  },
});

export const apiRateLimiter = rateLimit({
  windowSeconds: 60,
  maxRequests: 100,
  keyPrefix: "rate-limit:api",
  keyGenerator: (req) => {
    return req.user?.userId ?? req.ip ?? req.socket.remoteAddress ?? "unknown";
  },
});
