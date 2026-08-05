import prisma from "#utils/prisma";

type SeedServerInput = {
  ownerId: string;
  name: string;
};

export async function seedServer({ ownerId, name }: SeedServerInput) {
  console.log(`🌱 Seeding Server: ${name}...`);

  const existingServer = await prisma.server.findFirst({
    where: {
      ownerId,
      name,
    },
    select: {
      id: true,
      ownerId: true,
      name: true,
    },
  });

  const server =
    existingServer ??
    (await prisma.server.create({
      data: {
        ownerId,
        name,
      },
      select: {
        id: true,
        ownerId: true,
        name: true,
      },
    }));

  console.log(`✅ Server "${server.name}" berhasil dibuat`);

  return server;
}
