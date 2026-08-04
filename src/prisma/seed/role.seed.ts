import prisma from "#utils/prisma";

export async function seedRole(serverId: string) {
  console.log("🌱 Seeding Default Role...");

  const existingDefaultRole = await prisma.role.findFirst({
    where: {
      serverId,
      isDefault: true,
    },
    select: {
      id: true,
      serverId: true,
      name: true,
      permissionsBitmask: true,
      position: true,
      isDefault: true,
    },
  });

  const defaultRole =
    existingDefaultRole ??
    (await prisma.role.create({
      data: {
        serverId,
        name: "@everyone",
        permissionsBitmask: BigInt(0),
        position: 0,
        isDefault: true,
      },
      select: {
        id: true,
        serverId: true,
        name: true,
        permissionsBitmask: true,
        position: true,
        isDefault: true,
      },
    }));

  console.log("✅ Role @everyone berhasil dibuat");

  return defaultRole;
}
