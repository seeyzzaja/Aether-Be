import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import test from "node:test";
import request from "supertest";

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
  { default: prisma },
  { hashPassword },
  { generateAccessToken },
  { default: app },
] = await Promise.all([
  import("#utils/prisma"),
  import("#utils/password"),
  import("#utils/jwt"),
  import("../src/app.js"),
]);

async function resetDatabase() {
  await prisma.messageAttachment.deleteMany();
  await prisma.reaction.deleteMany();
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

function hashRefreshToken(refreshToken: string) {
  return createHash("sha256").update(refreshToken).digest("hex");
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

async function createAuthSession(user: {
  id: string;
  email: string;
  username: string;
}) {
  const sessionId = randomUUID();
  const refreshToken = randomUUID().replace(/-/g, "");

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      refreshTokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      deviceInfo: "Reaction Test Device",
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

function authHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

async function createDm(actorToken: string, targetId: string) {
  const response = await request(app)
    .post("/api/conversations/dm")
    .set(authHeaders(actorToken))
    .send({
      userId: targetId,
    });

  assert.equal(response.status, 201);

  return response.body.data;
}

async function createMessage(
  token: string,
  channelId: string,
  content = "Reaction test message"
) {
  const response = await request(app)
    .post(`/api/message/${channelId}`)
    .set(authHeaders(token))
    .send({
      content,
    });

  assert.equal(response.status, 201);

  return response.body.data;
}

test.beforeEach(async () => {
  await resetDatabase();
});

test.after(async () => {
  await resetDatabase();
  await prisma.$disconnect();
});

test("Reaction integration", async () => {
  const actor = await createUser({
    email: "reaction-actor@example.com",
    username: "reaction_actor",
  });

  const target = await createUser({
    email: "reaction-target@example.com",
    username: "reaction_target",
  });

  const outsider = await createUser({
    email: "reaction-outsider@example.com",
    username: "reaction_outsider",
  });

  const actorToken = await createAuthSession(actor);
  const targetToken = await createAuthSession(target);
  const outsiderToken = await createAuthSession(outsider);

  /*
   * ============================================================
   * 1. CREATE DM
   * ============================================================
   */

  const conversation = await createDm(actorToken, target.id);

  const channelId = conversation.id;

  assert.equal(conversation.type, "DM");
  assert.equal(conversation.dmParticipants.length, 2);

  /*
   * ============================================================
   * 2. CREATE MESSAGE
   * ============================================================
   */

  const message = await createMessage(actorToken, channelId, "Hello reaction");

  assert.ok(message.id);

  /*
   * ============================================================
   * 3. PARTICIPANT CAN ADD REACTION
   * ============================================================
   */

  const addReactionResponse = await request(app)
    .post(`/api/message/${message.id}/reactions`)
    .set(authHeaders(targetToken))
    .send({
      emoji: "👍",
    });

  assert.equal(addReactionResponse.status, 201);
  assert.equal(addReactionResponse.body.success, true);
  assert.equal(addReactionResponse.body.data.messageId, message.id);
  assert.equal(addReactionResponse.body.data.userId, target.id);
  assert.equal(addReactionResponse.body.data.emoji, "👍");

  /*
   * ============================================================
   * 4. USER TIDAK BOLEH ADD REACTION YANG SAMA DUA KALI
   * ============================================================
   */

  const duplicateReactionResponse = await request(app)
    .post(`/api/message/${message.id}/reactions`)
    .set(authHeaders(targetToken))
    .send({
      emoji: "👍",
    });

  assert.equal(duplicateReactionResponse.status, 409);

  /*
   * ============================================================
   * 5. PARTICIPANT LAIN BOLEH ADD REACTION
   * ============================================================
   */

  const secondReactionResponse = await request(app)
    .post(`/api/message/${message.id}/reactions`)
    .set(authHeaders(actorToken))
    .send({
      emoji: "❤️",
    });

  assert.equal(secondReactionResponse.status, 201);
  assert.equal(secondReactionResponse.body.data.userId, actor.id);
  assert.equal(secondReactionResponse.body.data.emoji, "❤️");

  /*
   * ============================================================
   * 6. LIST REACTIONS
   * ============================================================
   */

  const listResponse = await request(app)
    .get(`/api/message/${message.id}/reactions`)
    .set(authHeaders(actorToken));

  assert.equal(listResponse.status, 200);
  assert.equal(listResponse.body.success, true);
  assert.equal(listResponse.body.data.length, 2);

  const emojis = listResponse.body.data.map(
    (reaction: { emoji: string }) => reaction.emoji
  );

  assert.deepEqual(emojis, ["👍", "❤️"]);

  /*
   * ============================================================
   * 7. OUTSIDER TIDAK BOLEH MELIHAT REACTION
   * ============================================================
   */

  const outsiderListResponse = await request(app)
    .get(`/api/message/${message.id}/reactions`)
    .set(authHeaders(outsiderToken));

  assert.equal(outsiderListResponse.status, 403);

  /*
   * ============================================================
   * 8. OUTSIDER TIDAK BOLEH ADD REACTION
   * ============================================================
   */

  const outsiderAddResponse = await request(app)
    .post(`/api/message/${message.id}/reactions`)
    .set(authHeaders(outsiderToken))
    .send({
      emoji: "😂",
    });

  assert.equal(outsiderAddResponse.status, 403);

  /*
   * ============================================================
   * 9. USER TIDAK BOLEH DELETE REACTION MILIK USER LAIN
   * ============================================================
   *
   * actor mencoba menghapus reaction 👍 milik target.
   */

  const deleteOtherReactionResponse = await request(app)
    .delete(`/api/message/${message.id}/reactions`)
    .set(authHeaders(actorToken))
    .send({
      emoji: "👍",
    });

  assert.equal(deleteOtherReactionResponse.status, 404);

  /*
   * ============================================================
   * 10. OWNER REACTION BOLEH DELETE
   * ============================================================
   */

  const deleteReactionResponse = await request(app)
    .delete(`/api/message/${message.id}/reactions`)
    .set(authHeaders(targetToken))
    .send({
      emoji: "👍",
    });

  assert.equal(deleteReactionResponse.status, 200);
  assert.equal(deleteReactionResponse.body.success, true);

  /*
   * ============================================================
   * 11. VERIFY DATABASE
   * ============================================================
   */

  const reactions = await prisma.reaction.findMany({
    where: {
      messageId: message.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  assert.equal(reactions.length, 1);
  assert.equal(reactions[0].userId, actor.id);
  assert.equal(reactions[0].emoji, "❤️");
});
