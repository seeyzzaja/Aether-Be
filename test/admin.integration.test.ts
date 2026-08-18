import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import test from "node:test";

process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const adminUserId = randomUUID();
process.env.ADMIN_USER_IDS = adminUserId;

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
  { adminService },
  { adminController },
  { default: prisma },
  { generateAccessToken },
  { verifyAccessToken },
  { hashPassword },
] = await Promise.all([
  import("#modules/admin/service/admin.service"),
  import("#modules/admin/controller/admin.controller"),
  import("#utils/prisma"),
  import("#utils/jwt"),
  import("#shared/auth/access-token.service"),
  import("#utils/password"),
]);

type AdminUsersListResult = Awaited<ReturnType<typeof adminService.listUsers>>;
type AdminUsersListItem = AdminUsersListResult["users"][number];

function hashRefreshToken(refreshToken: string) {
  return createHash("sha256").update(refreshToken).digest("hex");
}

async function resetDatabase() {
  await prisma.auditLog.deleteMany();
  await prisma.messageAttachment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.serverMemberRole.deleteMany();
  await prisma.serverMember.deleteMany();
  await prisma.channelPermissionOverride.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.role.deleteMany();
  await prisma.server.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
}

async function createUser(input: {
  id: string;
  email: string;
  username: string;
}) {
  const passwordHash = await hashPassword("Password123!");

  return prisma.user.create({
    data: {
      id: input.id,
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
      deviceInfo: "Test Device",
      ipAddress: "127.0.0.1",
    },
  });

  return {
    sessionId,
    refreshToken,
    accessToken: generateAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      sessionId,
    }),
  };
}

async function createServerFixture(ownerId: string, name: string) {
  const server = await prisma.server.create({
    data: {
      ownerId,
      name,
    },
  });

  const everyoneRole = await prisma.role.create({
    data: {
      serverId: server.id,
      name: "@everyone",
      permissionsBitmask: 0n,
      isDefault: true,
      position: 0,
    },
  });

  const kickRole = await prisma.role.create({
    data: {
      serverId: server.id,
      name: "Moderator",
      permissionsBitmask: 1024n,
      isDefault: false,
      position: 50,
    },
  });

  const member = await prisma.serverMember.create({
    data: {
      serverId: server.id,
      userId: ownerId,
    },
  });

  await prisma.serverMemberRole.createMany({
    data: [
      {
        serverMemberId: member.id,
        roleId: everyoneRole.id,
      },
      {
        serverMemberId: member.id,
        roleId: kickRole.id,
      },
    ],
  });

  return { server, everyoneRole, kickRole, member };
}

async function createChannel(serverId: string) {
  return prisma.channel.create({
    data: {
      serverId,
      name: "general",
      type: "TEXT",
      position: 0,
    },
  });
}

async function createMember(serverId: string, userId: string, roleId: string) {
  const member = await prisma.serverMember.create({
    data: {
      serverId,
      userId,
    },
  });

  await prisma.serverMemberRole.create({
    data: {
      serverMemberId: member.id,
      roleId,
    },
  });

  return member;
}

test.beforeEach(async () => {
  await resetDatabase();
});

test("T18.1 integration", async () => {
  try {
    const adminUser = await createUser({
      id: adminUserId,
      email: "admin@example.com",
      username: "platform_admin",
    });
    await createAuthSession(adminUser);

    const normalUser = await createUser({
      id: randomUUID(),
      email: "user@example.com",
      username: "normal_user",
    });
    await createAuthSession(normalUser);

    const suspendTarget = await createUser({
      id: randomUUID(),
      email: "suspend@example.com",
      username: "suspend_target",
    });
    const suspendSession = await createAuthSession(suspendTarget);

    const serverA = await createServerFixture(adminUser.id, "Server A");
    const serverBOwner = await createUser({
      id: randomUUID(),
      email: "serverb@example.com",
      username: "server_b_owner",
    });
    const serverB = await createServerFixture(serverBOwner.id, "Server B");

    const channelA = await createChannel(serverA.server.id);
    const channelB = await createChannel(serverB.server.id);

    const authorizedMessage = await prisma.message.create({
      data: {
        channelId: channelA.id,
        authorId: adminUser.id,
        content: "authorized",
      },
    });

    const unauthorizedMessage = await prisma.message.create({
      data: {
        channelId: channelB.id,
        authorId: serverBOwner.id,
        content: "unauthorized",
      },
    });

    const targetMemberAUser = await createUser({
      id: randomUUID(),
      email: "member-a@example.com",
      username: "member_a",
    });

    const targetMemberBUser = await createUser({
      id: randomUUID(),
      email: "member-b@example.com",
      username: "member_b",
    });

    const targetMemberA = await createMember(
      serverA.server.id,
      targetMemberAUser.id,
      serverA.everyoneRole.id
    );

    const targetMemberB = await createMember(
      serverB.server.id,
      targetMemberBUser.id,
      serverB.everyoneRole.id
    );

    const usersResult = await adminService.listUsers(adminUser.id, {
      page: 1,
      limit: 10,
      q: "example",
    });

    assert.ok(usersResult.total >= 4);

    assert.ok(
      usersResult.users.every(
        (user: AdminUsersListItem) => !("passwordHash" in user)
      )
    );

    await assert.rejects(
      () =>
        adminService.listUsers(normalUser.id, {
          page: 1,
          limit: 10,
        }),
      /admin panel/
    );

    const suspendedUser = await adminService.suspendUser(
      adminUser.id,
      suspendTarget.id
    );

    assert.ok(suspendedUser.deletedAt instanceof Date);

    const updatedSuspendTarget = await prisma.user.findUniqueOrThrow({
      where: {
        id: suspendTarget.id,
      },
    });

    assert.ok(updatedSuspendTarget.deletedAt instanceof Date);

    const suspendedSessions = await prisma.session.findMany({
      where: {
        userId: suspendTarget.id,
      },
    });

    assert.equal(suspendedSessions.length, 1);

    assert.ok(suspendedSessions[0]?.revokedAt instanceof Date);

    await assert.rejects(
      () => verifyAccessToken(suspendSession.accessToken),
      /Akun telah disuspend|Sesi telah dicabut/
    );

    const otherTargetUser = await createUser({
      id: randomUUID(),
      email: "other-target@example.com",
      username: "other_target",
    });

    await prisma.auditLog.create({
      data: {
        actorId: adminUser.id,
        action: "admin.user_suspend",
        targetType: "user",
        targetId: otherTargetUser.id,
        metadata: {
          targetUserId: otherTargetUser.id,
        },
      },
    });

    const originalListAuditLogs = adminService.listAuditLogs.bind(adminService);

    let forwardedQuery:
      | {
          actorId?: string;
          targetId?: string;
          action?: string;
          targetType?: string;
          startTime?: Date;
          endTime?: Date;
          page: number;
          limit: number;
        }
      | undefined;

    (adminService as Mutable<typeof adminService>).listAuditLogs = async (
      actorId,
      query
    ) => {
      forwardedQuery = query;
      return originalListAuditLogs(actorId, query as never);
    };

    try {
      await adminController.listAuditLogs(
        {
          user: {
            userId: adminUser.id,
          },
          query: {
            page: "1",
            limit: "10",
            userId: suspendTarget.id,
            actorId: adminUser.id,
            action: "admin.user_suspend",
            targetType: "user",
          },
        } as never,
        {
          status: (_code: number) => ({
            json: (payload: unknown) => payload,
          }),
        } as never,
        (() => undefined) as never
      );
    } finally {
      (adminService as Mutable<typeof adminService>).listAuditLogs =
        originalListAuditLogs;
    }

    assert.equal(forwardedQuery?.targetId, suspendTarget.id);
    assert.equal(forwardedQuery?.actorId, adminUser.id);
    assert.equal(forwardedQuery?.action, "admin.user_suspend");
    assert.equal(forwardedQuery?.targetType, "user");

    const filteredAuditLogs = await adminService.listAuditLogs(adminUser.id, {
      actorId: adminUser.id,
      targetId: suspendTarget.id,
      action: "admin.user_suspend",
      targetType: "user",
      page: 1,
      limit: 10,
    } as never);

    assert.equal(filteredAuditLogs.total, 1);
    assert.equal(filteredAuditLogs.auditLogs[0]?.targetId, suspendTarget.id);

    const auditLogs = await adminService.listAuditLogs(adminUser.id, {
      actorId: adminUser.id,
      action: "admin.user_suspend",
      page: 1,
      limit: 10,
    });

    assert.equal(auditLogs.total, 2);
    assert.equal(auditLogs.auditLogs[0]?.action, "admin.user_suspend");

    await prisma.auditLog.create({
      data: {
        actorId: adminUser.id,
        action: "message.bulk_delete",
        targetType: "message",
        targetId: "bulk",
        metadata: {
          messageIds: [authorizedMessage.id, unauthorizedMessage.id],
        },
      },
    });

    const bulkDeleteResult = await adminService.bulkDeleteMessages(
      adminUser.id,
      [authorizedMessage.id, unauthorizedMessage.id]
    );

    assert.equal(bulkDeleteResult.length, 2);

    assert.ok(
      bulkDeleteResult.some(
        (item) =>
          item.messageId === authorizedMessage.id && item.status === "deleted"
      )
    );

    assert.ok(
      bulkDeleteResult.some(
        (item) =>
          item.messageId === unauthorizedMessage.id &&
          item.status === "forbidden"
      )
    );

    const deletedMessage = await prisma.message.findUniqueOrThrow({
      where: {
        id: authorizedMessage.id,
      },
    });

    const untouchedMessage = await prisma.message.findUniqueOrThrow({
      where: {
        id: unauthorizedMessage.id,
      },
    });

    assert.equal(deletedMessage.isDeleted, true);
    assert.equal(untouchedMessage.isDeleted, false);

    await prisma.auditLog.create({
      data: {
        actorId: adminUser.id,
        action: "member.bulk_kick",
        targetType: "member",
        targetId: "bulk",
        metadata: {
          memberIds: [targetMemberA.id, targetMemberB.id],
        },
      },
    });

    const bulkKickResult = await adminService.bulkKickMembers(adminUser.id, [
      targetMemberA.id,
      targetMemberB.id,
    ]);

    assert.equal(bulkKickResult.length, 2);

    assert.ok(
      bulkKickResult.some(
        (item) => item.memberId === targetMemberA.id && item.status === "kicked"
      )
    );

    assert.ok(
      bulkKickResult.some(
        (item) =>
          item.memberId === targetMemberB.id && item.status === "forbidden"
      )
    );

    const removedMember = await prisma.serverMember.findUnique({
      where: {
        id: targetMemberA.id,
      },
    });

    const retainedMember = await prisma.serverMember.findUnique({
      where: {
        id: targetMemberB.id,
      },
    });

    assert.equal(removedMember, null);
    assert.ok(retainedMember);

    await assert.rejects(
      () =>
        adminService.bulkDeleteMessages(normalUser.id, [
          authorizedMessage.id,
          unauthorizedMessage.id,
        ]),
      /admin panel/
    );

    await assert.rejects(
      () =>
        adminService.bulkKickMembers(normalUser.id, [
          targetMemberA.id,
          targetMemberB.id,
        ]),
      /admin panel/
    );
  } finally {
    await prisma.$disconnect();
  }
});
