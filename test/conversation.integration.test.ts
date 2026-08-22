import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import test from "node:test";
import request from "supertest";

process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.REDIS_URL =
  process.env.REDIS_URL || "redis://127.0.0.1:6379";

console.log(
  `TEST DATABASE: ${process.env.DATABASE_URL ?? "DATABASE_URL NOT SET"}`,
);

const { redisClient } =
  await import("../src/shared/redis/redis.client.js");

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

const [{ disconnectRedis }, { disconnectQueueConnection }] = await Promise.all([
  import("../src/shared/redis/redis.client.js"),
  import("../src/shared/queue/redis.connection.js"),
]);

async function resetDatabase() {
  console.log("TEST: resetDatabase START");

  await prisma.messageAttachment.deleteMany();
  console.log("TEST: messageAttachment cleared");

  await prisma.message.deleteMany();
  console.log("TEST: message cleared");

  await prisma.dmParticipant.deleteMany();
  console.log("TEST: dmParticipant cleared");

  await prisma.channel.deleteMany();
  console.log("TEST: channel cleared");

  await prisma.serverMemberRole.deleteMany();
  console.log("TEST: serverMemberRole cleared");

  await prisma.serverMember.deleteMany();
  console.log("TEST: serverMember cleared");

  await prisma.channelPermissionOverride.deleteMany();
  console.log("TEST: channelPermissionOverride cleared");

  await prisma.role.deleteMany();
  console.log("TEST: role cleared");

  await prisma.server.deleteMany();
  console.log("TEST: server cleared");

  await prisma.session.deleteMany();
  console.log("TEST: session cleared");

  await prisma.auditLog.deleteMany();
  console.log("TEST: auditLog cleared");

  await prisma.user.deleteMany();
  console.log("TEST: user cleared");

  console.log("TEST: resetDatabase DONE");
}

function hashRefreshToken(refreshToken: string) {
  return createHash("sha256").update(refreshToken).digest("hex");
}

async function createUser(input: {
  id?: string;
  email: string;
  username: string;
}) {
  console.log(`TEST: createUser START ${input.username}`);

  const passwordHash = await hashPassword("Password123!");

  const user = await prisma.user.create({
    data: {
      id: input.id ?? randomUUID(),
      email: input.email,
      username: input.username,
      passwordHash,
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`TEST: createUser DONE ${input.username}`);

  return user;
}

async function createAuthSession(user: {
  id: string;
  email: string;
  username: string;
}) {
  console.log(`TEST: createAuthSession START ${user.username}`);

  const sessionId = randomUUID();

  const refreshToken = randomUUID().replace(/-/g, "");

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      refreshTokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ),
      deviceInfo: "T20.1 Test Device",
      ipAddress: "127.0.0.1",
    },
  });

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    username: user.username,
    sessionId,
  });

  console.log(`TEST: createAuthSession DONE ${user.username}`);

  return accessToken;
}

function authHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

test.beforeEach(async () => {
  console.log("TEST: beforeEach START");

  await resetDatabase();

  console.log("TEST: beforeEach DONE");
});

test.after(async () => {
  console.log("TEST: after START");

  await resetDatabase();

  console.log("TEST: after reset DONE");

  await disconnectQueueConnection();
  await disconnectRedis();
  await prisma.$disconnect();

  console.log("TEST: prisma disconnected");
});

test("T20.1 integration", async () => {
  console.log("TEST: T20.1 START");

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

  console.log("TEST: all users CREATED");

  const actorToken = await createAuthSession(actor);
  const targetToken = await createAuthSession(target);
  const thirdUserToken = await createAuthSession(thirdUser);
  const outsiderToken = await createAuthSession(outsider);

  console.log("TEST: all auth sessions CREATED");

  /*
   * ============================================================
   * 1. CREATE DIRECT MESSAGE
   * ============================================================
   */

  console.log("TEST 1: CREATE DIRECT MESSAGE");

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
    (participant: { user: { id: string } }) => participant.user.id,
  );

  assert.deepEqual(
    new Set(participantIds),
    new Set([actor.id, target.id]),
  );

  /*
   * ============================================================
   * 2. CREATE SAME DM AGAIN
   * ============================================================
   */

  console.log("TEST 2: CREATE SAME DM AGAIN");

  const duplicateDmResponse = await request(app)
    .post("/api/conversations/dm")
    .set(authHeaders(actorToken))
    .send({
      userId: target.id,
    });

  assert.equal(duplicateDmResponse.status, 201);
  assert.equal(duplicateDmResponse.body.success, true);
  assert.equal(
    duplicateDmResponse.body.data.id,
    dmConversationId,
  );

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

  console.log("TEST 3: SELF DM");

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

  console.log("TEST 4: MISSING DM USER");

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

  console.log("TEST 5: GET ALL CONVERSATIONS");

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

  console.log("TEST 6: GET CONVERSATION DETAIL PARTICIPANT");

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

  console.log("TEST 7: GET CONVERSATION DETAIL NON PARTICIPANT");

  const forbiddenConversationResponse = await request(app)
    .get(`/api/conversations/${dmConversationId}`)
    .set(authHeaders(outsiderToken));

  assert.equal(forbiddenConversationResponse.status, 403);

  /*
   * ============================================================
   * 8. CREATE GROUP DM
   * ============================================================
   */

  console.log("TEST 8: CREATE GROUP DM");

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
    (participant: { user: { id: string } }) => participant.user.id,
  );

  assert.deepEqual(
    new Set(groupParticipantIds),
    new Set([actor.id, target.id, thirdUser.id]),
  );

  const groupConversationId = groupBody.data.id;

  /*
   * ============================================================
   * 9. UPDATE GROUP DM
   * ============================================================
   */

console.log("TEST 9: UPDATE GROUP DM REQUEST START");

const updateGroupResponse = await request(app)
  .patch(`/api/conversations/${groupConversationId}`)
  .set(authHeaders(actorToken))
  .send({
    name: "Aether Developers",
    iconUrl: "https://example.com/group-icon.png",
  });

console.log("TEST 9: UPDATE GROUP DM RESPONSE", {
  status: updateGroupResponse.status,
  body: updateGroupResponse.body,
});

assert.equal(updateGroupResponse.status, 200);
assert.equal(updateGroupResponse.body.success, true);
assert.equal(
  updateGroupResponse.body.data.id,
  groupConversationId,
);
assert.equal(
  updateGroupResponse.body.data.name,
  "Aether Developers",
);
assert.equal(
  updateGroupResponse.body.data.iconUrl,
  "https://example.com/group-icon.png",
);

console.log("TEST 9: UPDATE GROUP DM DONE");

  assert.equal(updateGroupResponse.status, 200);
  assert.equal(updateGroupResponse.body.success, true);
  assert.equal(updateGroupResponse.body.data.id, groupConversationId);
  assert.equal(updateGroupResponse.body.data.name, "Aether Developers");
  assert.equal(
    updateGroupResponse.body.data.iconUrl,
    "https://example.com/group-icon.png",
  );

  /*
   * ============================================================
   * 10. UPDATE GROUP DM - ICON ONLY
   * ============================================================
   */

  console.log("TEST 10: UPDATE GROUP DM ICON ONLY");

  const updateIconOnlyResponse = await request(app)
    .patch(`/api/conversations/${groupConversationId}`)
    .set(authHeaders(actorToken))
    .send({
      iconUrl: null,
    });

  assert.equal(updateIconOnlyResponse.status, 200);
  assert.equal(updateIconOnlyResponse.body.success, true);
  assert.equal(
    updateIconOnlyResponse.body.data.name,
    "Aether Developers",
  );
  assert.equal(
    updateIconOnlyResponse.body.data.iconUrl,
    null,
  );

  /*
   * ============================================================
   * 11. ADD PARTICIPANT
   * ============================================================
   */

  console.log("TEST 11: ADD PARTICIPANT");

  const addParticipantResponse = await request(app)
    .post(
      `/api/conversations/${groupConversationId}/participants`,
    )
    .set(authHeaders(actorToken))
    .send({
      userId: outsider.id,
    });

  assert.equal(addParticipantResponse.status, 200);
  assert.equal(addParticipantResponse.body.success, true);

  const addedParticipantIds =
    addParticipantResponse.body.data.dmParticipants.map(
      (participant: { user: { id: string } }) =>
        participant.user.id,
    );

  assert.equal(addedParticipantIds.length, 4);
  assert.ok(addedParticipantIds.includes(actor.id));
  assert.ok(addedParticipantIds.includes(target.id));
  assert.ok(addedParticipantIds.includes(thirdUser.id));
  assert.ok(addedParticipantIds.includes(outsider.id));

  /*
   * ============================================================
   * 12. ADD PARTICIPANT - DIRI SENDIRI
   * ============================================================
   */

  console.log("TEST 12: ADD SELF");

  const addSelfResponse = await request(app)
    .post(
      `/api/conversations/${groupConversationId}/participants`,
    )
    .set(authHeaders(actorToken))
    .send({
      userId: actor.id,
    });

  assert.equal(addSelfResponse.status, 400);

  /*
   * ============================================================
   * 13. ADD PARTICIPANT - DUPLICATE
   * ============================================================
   */

  console.log("TEST 13: ADD DUPLICATE");

  const addDuplicateResponse = await request(app)
    .post(
      `/api/conversations/${groupConversationId}/participants`,
    )
    .set(authHeaders(actorToken))
    .send({
      userId: target.id,
    });

  assert.equal(addDuplicateResponse.status, 400);

  /*
   * ============================================================
   * 14. ADD PARTICIPANT - USER TIDAK DITEMUKAN
   * ============================================================
   */

  console.log("TEST 14: ADD MISSING USER");

  const addMissingUserResponse = await request(app)
    .post(
      `/api/conversations/${groupConversationId}/participants`,
    )
    .set(authHeaders(actorToken))
    .send({
      userId: randomUUID(),
    });

  assert.equal(addMissingUserResponse.status, 404);

  /*
   * ============================================================
   * 15. REMOVE PARTICIPANT
   * ============================================================
   */

  console.log("TEST 15: REMOVE PARTICIPANT");

  const removeParticipantResponse = await request(app)
    .delete(
      `/api/conversations/${groupConversationId}/participants`,
    )
    .set(authHeaders(actorToken))
    .send({
      userId: thirdUser.id,
    });

  assert.equal(removeParticipantResponse.status, 200);
  assert.equal(removeParticipantResponse.body.success, true);

  assert.equal(
    removeParticipantResponse.body.data.channelId,
    groupConversationId,
  );

  assert.equal(
    removeParticipantResponse.body.data.removedUserId,
    thirdUser.id,
  );

  assert.equal(
    removeParticipantResponse.body.data.left,
    false,
  );

  const remainingAfterRemove =
    removeParticipantResponse.body.data.remainingParticipants.map(
      (user: { id: string }) => user.id,
    );

  assert.equal(remainingAfterRemove.length, 3);
  assert.ok(remainingAfterRemove.includes(actor.id));
  assert.ok(remainingAfterRemove.includes(target.id));
  assert.ok(remainingAfterRemove.includes(outsider.id));
  assert.ok(!remainingAfterRemove.includes(thirdUser.id));

  /*
   * ============================================================
   * 16. REMOVE PARTICIPANT - USER BUKAN PARTICIPANT
   * ============================================================
   */

  console.log("TEST 16: REMOVE NON PARTICIPANT");

  const removeNonParticipantResponse = await request(app)
    .delete(
      `/api/conversations/${groupConversationId}/participants`,
    )
    .set(authHeaders(actorToken))
    .send({
      userId: thirdUser.id,
    });

  assert.equal(removeNonParticipantResponse.status, 404);

  /*
   * ============================================================
   * 17. NON PARTICIPANT TIDAK BOLEH MANAGEMENT GROUP DM
   * ============================================================
   */

  console.log("TEST 17: NON PARTICIPANT MANAGEMENT");

  const forbiddenUpdateResponse = await request(app)
    .patch(`/api/conversations/${groupConversationId}`)
    .set(authHeaders(thirdUserToken))
    .send({
      name: "Unauthorized Update",
    });

  assert.equal(forbiddenUpdateResponse.status, 403);

  const forbiddenAddResponse = await request(app)
    .post(
      `/api/conversations/${groupConversationId}/participants`,
    )
    .set(authHeaders(thirdUserToken))
    .send({
      userId: thirdUser.id,
    });

  assert.equal(forbiddenAddResponse.status, 403);

  const forbiddenRemoveResponse = await request(app)
    .delete(
      `/api/conversations/${groupConversationId}/participants`,
    )
    .set(authHeaders(thirdUserToken))
    .send({
      userId: actor.id,
    });

  assert.equal(forbiddenRemoveResponse.status, 403);

  /*
   * ============================================================
   * 18. PARTICIPANT LEAVE SENDIRI
   * ============================================================
   */

  console.log("TEST 18: PARTICIPANT LEAVE");

  const leaveGroupResponse = await request(app)
    .delete(
      `/api/conversations/${groupConversationId}/participants`,
    )
    .set(authHeaders(targetToken))
    .send({
      userId: target.id,
    });

  assert.equal(leaveGroupResponse.status, 200);
  assert.equal(leaveGroupResponse.body.success, true);

  assert.equal(
    leaveGroupResponse.body.data.removedUserId,
    target.id,
  );

  assert.equal(
    leaveGroupResponse.body.data.left,
    true,
  );

  const remainingAfterLeave =
    leaveGroupResponse.body.data.remainingParticipants.map(
      (user: { id: string }) => user.id,
    );

  assert.equal(remainingAfterLeave.length, 2);
  assert.ok(remainingAfterLeave.includes(actor.id));
  assert.ok(remainingAfterLeave.includes(outsider.id));
  assert.ok(!remainingAfterLeave.includes(target.id));

  /*
   * ============================================================
   * 19. GROUP DM DENGAN CREATOR DI userIds
   * ============================================================
   */

  console.log("TEST 19: INVALID CREATOR IN USER IDS");

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
   * 20. GROUP DM DUPLICATE USER ID
   * ============================================================
   */

  console.log("TEST 20: DUPLICATE GROUP USER");

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
   * 21. GROUP DM TARGET USER TIDAK ADA
   * ============================================================
   */

  console.log("TEST 21: MISSING GROUP USER");

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
   * 22. GET ALL CONVERSATIONS SETELAH GROUP DM
   * ============================================================
   */

  console.log("TEST 22: FINAL CONVERSATIONS");

  const finalConversationsResponse = await request(app)
    .get("/api/conversations")
    .set(authHeaders(actorToken));

  assert.equal(finalConversationsResponse.status, 200);
  assert.equal(finalConversationsResponse.body.success, true);

  const finalConversationsBody = finalConversationsResponse.body;

  assert.equal(finalConversationsBody.data.length, 2);

  const conversationTypes = finalConversationsBody.data.map(
    (conversation: { type: string }) => conversation.type,
  );

  assert.ok(conversationTypes.includes("DM"));
  assert.ok(conversationTypes.includes("GROUP_DM"));

  /*
   * ============================================================
   * 23. VALIDASI CONVERSATION ID
   * ============================================================
   */

  console.log("TEST 23: INVALID CONVERSATION ID");

  const invalidConversationIdResponse = await request(app)
    .get("/api/conversations/not-a-uuid")
    .set(authHeaders(actorToken));

  assert.equal(invalidConversationIdResponse.status, 400);

  /*
   * ============================================================
   * 24. ENDPOINT MEMBUTUHKAN AUTH
   * ============================================================
   */

  console.log("TEST 24: AUTH REQUIRED");

  const unauthenticatedResponse = await request(app).get(
    "/api/conversations",
  );

  assert.equal(unauthenticatedResponse.status, 401);

  /*
   * ============================================================
   * 25. VERIFY DATABASE
   * ============================================================
   */

  console.log("TEST 25: VERIFY DATABASE");

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
      channelId: groupConversationId,
    },
  });

  assert.equal(groupParticipants, 2);

  const finalGroupParticipants =
    await prisma.dmParticipant.findMany({
      where: {
        channelId: groupConversationId,
      },
      select: {
        userId: true,
      },
    });

  assert.deepEqual(
    new Set(
      finalGroupParticipants.map(
        (participant: { userId: string }) => participant.userId,
      ),
    ),
    new Set([actor.id, outsider.id]),
  );

  console.log("TEST: T20.1 COMPLETED");
});
