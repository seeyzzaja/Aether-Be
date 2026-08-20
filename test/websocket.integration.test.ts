import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import WebSocket from "ws";

process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const { redisClient } = await import("../src/shared/redis/redis.client.js");

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

const mockRedisClient = redisClient as Mutable<typeof redisClient>;

Object.assign(mockRedisClient, {
  connect: async () => redisClient,
  exists: async () => 0,
  incr: async () => 1,
  decr: async () => 0,
  get: async () => null,
  del: async () => 0,
  set: async () => "OK",
  expire: async () => 1,
  ttl: async () => -2,
  publish: async () => 0,
  zRangeWithScores: async () => [],
  zRem: async () => 0,
  multi: () =>
    ({
      zRemRangeByScore: () => undefined,
      zAdd: () => undefined,
      zCard: () => undefined,
      expire: () => undefined,
      exec: async () => [0, 0, 0, 0],
    }) as never,
});

const [
  { default: prisma, disconnectPrisma },
  { hashPassword },
  { generateAccessToken },
  { startWebSocketServer },
] = await Promise.all([
  import("#utils/prisma"),
  import("#utils/password"),
  import("#utils/jwt"),
  import("../src/websocket/index.js"),
]);

async function resetDatabase() {
  await prisma.messageAttachment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.dmParticipant.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.serverMemberRole.deleteMany();
  await prisma.serverMember.deleteMany();
  await prisma.channelPermissionOverride.deleteMany();
  await prisma.role.deleteMany();
  await prisma.server.deleteMany();
  await prisma.session.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
}

async function createUser(input: { email: string; username: string }) {
  const passwordHash = await hashPassword("Password123!");

  return prisma.user.create({
    data: {
      id: randomUUID(),
      email: input.email,
      username: input.username,
      passwordHash,
      emailVerifiedAt: new Date(),
    },
  });
}

async function createAccessToken(user: {
  id: string;
  email: string;
  username: string;
}) {
  const sessionId = randomUUID();

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      refreshTokenHash: randomUUID(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      deviceInfo: "WebSocket Test",
      ipAddress: "127.0.0.1",
    },
  });

  return generateAccessToken({
    userId: user.id,
    email: user.email,
    username: user.username,
    sessionId,
  });
}

function waitForMessage(
  socket: WebSocket,
  predicate: (message: unknown) => boolean,
  timeout = 3000
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.removeListener("message", onMessage);
      reject(new Error("Timeout menunggu WebSocket message"));
    }, timeout);

    function onMessage(raw: WebSocket.RawData) {
      const message = JSON.parse(raw.toString());

      if (!predicate(message)) {
        return;
      }

      clearTimeout(timer);
      socket.removeListener("message", onMessage);
      resolve(message);
    }

    socket.on("message", onMessage);
  });
}

async function connectSocket(
  port: number,
  accessToken: string
): Promise<WebSocket> {
  const socket = new WebSocket(
    `ws://127.0.0.1:${port}?token=${encodeURIComponent(accessToken)}`
  );

  socket.on("message", (raw) => {
    console.log("[WS TEST MESSAGE]", raw.toString());
  });

  socket.on("error", (error) => {
    console.log("[WS TEST ERROR]", error);
  });

  socket.on("close", (code, reason) => {
    console.log("[WS TEST CLOSE]", code, reason.toString());
  });

  await new Promise<void>((resolve, reject) => {
    socket.once("open", () => {
      console.log("[WS TEST OPEN]");
      resolve();
    });

    socket.once("error", reject);
  });

  await waitForMessage(socket, (message: any) => message.event === "connected");

  return socket;
}

const WS_PORT = 18999;

const websocketServer = await startWebSocketServer(WS_PORT);

test.beforeEach(async () => {
  await resetDatabase();
});

test.after(async () => {
  console.log("[WS TEST CLEANUP] start");

  await resetDatabase();

  console.log("[WS TEST CLEANUP] database reset");

  await websocketServer.close();

  console.log("[WS TEST CLEANUP] websocket server closed");

  await disconnectPrisma();

  console.log("[WS TEST CLEANUP] prisma + pool disconnected");

  console.log("[WS TEST CLEANUP] after hook finished");
});

test("WebSocket DM SUBSCRIBE - participant berhasil subscribe", async () => {
  const user = await createUser({
    email: "dm-participant@test.local",
    username: "dm_participant",
  });

  const channel = await prisma.channel.create({
    data: {
      name: "direct-message",
      type: "DM",
    },
  });

  await prisma.dmParticipant.create({
    data: {
      channelId: channel.id,
      userId: user.id,
    },
  });

  const accessToken = await createAccessToken(user);
  const socket = await connectSocket(WS_PORT, accessToken);

  socket.send(
    JSON.stringify({
      event: "subscribe",
      data: {
        channelId: channel.id,
      },
    })
  );

  const response = await waitForMessage(
    socket,
    (message: any) => message.event === "subscribed"
  );

  assert.equal(response.data.channelId, channel.id);

  socket.close();
});

test("WebSocket DM SUBSCRIBE - non participant ditolak", async () => {
  const participant = await createUser({
    email: "participant@test.local",
    username: "participant",
  });

  const outsider = await createUser({
    email: "outsider@test.local",
    username: "outsider",
  });

  const channel = await prisma.channel.create({
    data: {
      name: "private-dm",
      type: "DM",
    },
  });

  await prisma.dmParticipant.create({
    data: {
      channelId: channel.id,
      userId: participant.id,
    },
  });

  const accessToken = await createAccessToken(outsider);

  const socket = await connectSocket(WS_PORT, accessToken);

  socket.send(
    JSON.stringify({
      event: "subscribe",
      data: {
        channelId: channel.id,
      },
    })
  );

  const response = await waitForMessage(
    socket,
    (message: any) => message.event === "error"
  );

  assert.equal(
    response.data.message,
    "Kamu bukan participant pada conversation ini"
  );

  socket.close();
});

test("WebSocket GROUP_DM SUBSCRIBE - participant berhasil subscribe", async () => {
  const user = await createUser({
    email: "group-participant@test.local",
    username: "group_participant",
  });

  const channel = await prisma.channel.create({
    data: {
      name: "group-dm",
      type: "GROUP_DM",
    },
  });

  await prisma.dmParticipant.create({
    data: {
      channelId: channel.id,
      userId: user.id,
    },
  });

  const accessToken = await createAccessToken(user);

  const socket = await connectSocket(WS_PORT, accessToken);

  socket.send(
    JSON.stringify({
      event: "subscribe",
      data: {
        channelId: channel.id,
      },
    })
  );

  const response = await waitForMessage(
    socket,
    (message: any) => message.event === "subscribed"
  );

  assert.equal(response.data.channelId, channel.id);

  socket.close();
});
