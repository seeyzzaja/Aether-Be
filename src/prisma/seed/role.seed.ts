import prisma from "#utils/prisma";

export async function seedRole(serverId: string) {
  console.log("🌱 Seeding Default Role...");

  const existingDefaultRole = await prisma.role.findFirst({
    where: {
      serverId,
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
    }));

  const existingAdminRole = await prisma.role.findFirst({
    where: {
      serverId,
      name: "Owner",
    },
  });

  const ownerRole =
    existingAdminRole ??
    (await prisma.role.create({
      data: {
        serverId,
        name: "Owner",
        permissionsBitmask: BigInt(8192),
        position: 100,
        isDefault: false,
      },
    }));

  console.log("✅ Role @everyone berhasil dibuat");
  console.log("✅ Role Owner berhasil dibuat");

  return {
    defaultRole,
    ownerRole,
  };
}
