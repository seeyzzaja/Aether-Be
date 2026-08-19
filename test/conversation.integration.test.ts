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
async function createUser(input: {
  id?: string;
  email: string;
  username: string;
}) {
  const passwordHash = await hashPassword("Password123!");

  return prisma.user.create({
    data: {
      id: input.id ?? randomUUID(),
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
      deviceInfo: "T20.1 Test Device",
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

test.beforeEach(async () => {
  await resetDatabase();
});

test.after(async () => {
  await resetDatabase();
  await prisma.$disconnect();
});

test("T20.1 integration", async () => {
  const actor = await createUser({
    email: "actor@example.com",
    username: "actor",
  });

  const target = await createUser({
    email: "target@example.com",
    username: "target",
  });

  const thirdUser = await createUser({
    email: "third@example.com",
    username: "third",
  });

  const outsider = await createUser({
    email: "outsider@example.com",
    username: "outsider",
  });

  const actorToken = await createAuthSession(actor);
  const targetToken = await createAuthSession(target);
  const outsiderToken = await createAuthSession(outsider);

  /*
   * ============================================================
   * 1. CREATE DIRECT MESSAGE
   * ============================================================
   */

  const createDmResponse = await request(app)
    .post("/api/conversations/dm")
    .set(authHeaders(actorToken))
    .send({
      userId: target.id,
    });

  assert.equal(createDmResponse.status, 201);
  assert.equal(createDmResponse.body.success, true);

  const createDmBody = createDmResponse.body;

  assert.ok(createDmBody.data);
  assert.equal(createDmBody.data.type, "DM");
  assert.equal(createDmBody.data.serverId, null);
  assert.equal(createDmBody.data.dmParticipants.length, 2);

  const dmConversationId = createDmBody.data.id;

  const participantIds = createDmBody.data.dmParticipants.map(
    (participant: { user: { id: string } }) => participant.user.id
  );

  assert.deepEqual(new Set(participantIds), new Set([actor.id, target.id]));

  /*
   * ============================================================
   * 2. CREATE SAME DM AGAIN
   * ============================================================
   */

  const duplicateDmResponse = await request(app)
    .post("/api/conversations/dm")
    .set(authHeaders(actorToken))
    .send({
      userId: target.id,
    });

  assert.equal(duplicateDmResponse.status, 201);
  assert.equal(duplicateDmResponse.body.success, true);
  assert.equal(duplicateDmResponse.body.data.id, dmConversationId);

  const dmCount = await prisma.channel.count({
    where: {
      type: "DM",
      serverId: null,
    },
  });

  assert.equal(dmCount, 1);

  /*
   * ============================================================
   * 3. USER TIDAK BOLEH DM DIRI SENDIRI
   * ============================================================
   */

  const selfDmResponse = await request(app)
    .post("/api/conversations/dm")
    .set(authHeaders(actorToken))
    .send({
      userId: actor.id,
    });

  assert.equal(selfDmResponse.status, 400);

  /*
   * ============================================================
   * 4. TARGET USER TIDAK DITEMUKAN
   * ============================================================
   */

  const missingUserResponse = await request(app)
    .post("/api/conversations/dm")
    .set(authHeaders(actorToken))
    .send({
      userId: randomUUID(),
    });

  assert.equal(missingUserResponse.status, 404);

  /*
   * ============================================================
   * 5. GET ALL CONVERSATIONS
   * ============================================================
   */

  const conversationsResponse = await request(app)
    .get("/api/conversations")
    .set(authHeaders(actorToken));

  assert.equal(conversationsResponse.status, 200);
  assert.equal(conversationsResponse.body.success, true);

  const conversationsBody = conversationsResponse.body;

  assert.ok(Array.isArray(conversationsBody.data));
  assert.equal(conversationsBody.data.length, 1);
  assert.equal(conversationsBody.data[0].id, dmConversationId);

  /*
   * ============================================================
   * 6. GET CONVERSATION DETAIL - PARTICIPANT
   * ============================================================
   */

  const conversationResponse = await request(app)
    .get(`/api/conversations/${dmConversationId}`)
    .set(authHeaders(targetToken));

  assert.equal(conversationResponse.status, 200);
  assert.equal(conversationResponse.body.success, true);

  const conversationBody = conversationResponse.body;

  assert.equal(conversationBody.data.id, dmConversationId);
  assert.equal(conversationBody.data.type, "DM");
  assert.equal(conversationBody.data.dmParticipants.length, 2);

  /*
   * ============================================================
   * 7. GET CONVERSATION DETAIL - NON PARTICIPANT
   * ============================================================
   */

  const forbiddenConversationResponse = await request(app)
    .get(`/api/conversations/${dmConversationId}`)
    .set(authHeaders(outsiderToken));

  assert.equal(forbiddenConversationResponse.status, 403);

  /*
   * ============================================================
   * 8. CREATE GROUP DM
   * ============================================================
   */

  const groupResponse = await request(app)
    .post("/api/conversations/group")
    .set(authHeaders(actorToken))
    .send({
      userIds: [target.id, thirdUser.id],
      name: "Aether Team",
    });

  assert.equal(groupResponse.status, 201);
  assert.equal(groupResponse.body.success, true);

  const groupBody = groupResponse.body;

  assert.ok(groupBody.data);
  assert.equal(groupBody.data.type, "GROUP_DM");
  assert.equal(groupBody.data.serverId, null);
  assert.equal(groupBody.data.name, "Aether Team");
  assert.equal(groupBody.data.dmParticipants.length, 3);

  const groupParticipantIds = groupBody.data.dmParticipants.map(
    (participant: { user: { id: string } }) => participant.user.id
  );

  assert.deepEqual(
    new Set(groupParticipantIds),
    new Set([actor.id, target.id, thirdUser.id])
  );

  /*
   * ============================================================
   * 9. GROUP DM DENGAN CREATOR DI userIds
   * ============================================================
   */

  const invalidGroupResponse = await request(app)
    .post("/api/conversations/group")
    .set(authHeaders(actorToken))
    .send({
      userIds: [actor.id, target.id],
      name: "Invalid Group",
    });

  assert.equal(invalidGroupResponse.status, 400);

  /*
   * ============================================================
   * 10. GROUP DM DUPLICATE USER ID
   * ============================================================
   */

  const duplicateParticipantResponse = await request(app)
    .post("/api/conversations/group")
    .set(authHeaders(actorToken))
    .send({
      userIds: [target.id, target.id],
      name: "Duplicate Group",
    });

  assert.equal(duplicateParticipantResponse.status, 400);

  /*
   * ============================================================
   * 11. GROUP DM TARGET USER TIDAK ADA
   * ============================================================
   */

  const missingGroupUserResponse = await request(app)
    .post("/api/conversations/group")
    .set(authHeaders(actorToken))
    .send({
      userIds: [target.id, randomUUID()],
      name: "Missing User Group",
    });

  assert.equal(missingGroupUserResponse.status, 404);

  /*
   * ============================================================
   * 12. GET ALL CONVERSATIONS SETELAH GROUP DM
   * ============================================================
   */

  const finalConversationsResponse = await request(app)
    .get("/api/conversations")
    .set(authHeaders(actorToken));

  assert.equal(finalConversationsResponse.status, 200);
  assert.equal(finalConversationsResponse.body.success, true);

  const finalConversationsBody = finalConversationsResponse.body;

  assert.equal(finalConversationsBody.data.length, 2);

  const conversationTypes = finalConversationsBody.data.map(
    (conversation: { type: string }) => conversation.type
  );

  assert.ok(conversationTypes.includes("DM"));
  assert.ok(conversationTypes.includes("GROUP_DM"));

  /*
   * ============================================================
   * 13. VALIDASI CONVERSATION ID
   * ============================================================
   */

  const invalidConversationIdResponse = await request(app)
    .get("/api/conversations/not-a-uuid")
    .set(authHeaders(actorToken));

  assert.equal(invalidConversationIdResponse.status, 400);

  /*
   * ============================================================
   * 14. ENDPOINT MEMBUTUHKAN AUTH
   * ============================================================
   */

  const unauthenticatedResponse = await request(app).get("/api/conversations");

  assert.equal(unauthenticatedResponse.status, 401);

  /*
   * ============================================================
   * 15. VERIFY DATABASE
   * ============================================================
   */

  const dmChannels = await prisma.channel.count({
    where: {
      type: "DM",
      serverId: null,
    },
  });

  const groupDmChannels = await prisma.channel.count({
    where: {
      type: "GROUP_DM",
      serverId: null,
    },
  });

  assert.equal(dmChannels, 1);
  assert.equal(groupDmChannels, 1);

  const dmParticipants = await prisma.dmParticipant.count({
    where: {
      channelId: dmConversationId,
    },
  });

  assert.equal(dmParticipants, 2);

  const groupParticipants = await prisma.dmParticipant.count({
    where: {
      channelId: groupBody.data.id,
    },
  });

  assert.equal(groupParticipants, 3);
});
