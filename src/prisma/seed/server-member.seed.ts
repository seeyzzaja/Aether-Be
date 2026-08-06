import prisma from "#utils/prisma";

type SeedServerMemberInput = {
  serverId: string;
  userId: string;
  roleId: string;
};

export async function seedServerMember({ serverId, userId, roleId }: SeedServerMemberInput) {
  console.log("🌱 Seeding Server Membership...");

  const member = await prisma.serverMember.upsert({
    where: {
      serverId_userId: {
        serverId,
        userId,
      },
    },
    update: {},
    create: {
      serverId,
      userId,
    },
    select: {
      id: true,
      serverId: true,
      userId: true,
      createdAt: true,
    },
  });

  await prisma.serverMemberRole.upsert({
    where: {
      serverMemberId_roleId: {
        serverMemberId: member.id,
        roleId,
      },
    },
    update: {},
    create: {
      serverMemberId: member.id,
      roleId,
    },
  });

  console.log("✅ User berhasil ditambahkan sebagai member server");

  return member;
}
