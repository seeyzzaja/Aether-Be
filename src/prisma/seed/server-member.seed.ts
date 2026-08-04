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
    update: {
      roleId,
    },
    create: {
      serverId,
      userId,
      roleId,
    },
    select: {
      id: true,
      serverId: true,
      userId: true,
      roleId: true,
      createdAt: true,
    },
  });

  console.log("✅ User berhasil ditambahkan sebagai member server");

  return member;
}
