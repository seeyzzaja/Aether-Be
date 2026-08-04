import { seedRole } from "#prisma/seed/role.seed";
import { seedServer } from "#prisma/seed/server.seed";
import { seedServerMember } from "#prisma/seed/server-member.seed";
import { seedUser } from "#prisma/seed/user.seed";
import prisma from "#utils/prisma";

async function main() {
  console.log("Menjalankan Aether Seeder...\n");

  const { owner1, owner2, member, password } = await seedUser();

  if (!owner1 || !owner2 || !member) {
    throw new Error(
      "Data user seed tidak lengkap. Seeder harus menghasilkan owner1, owner2, dan member.",
    );
  }

  const server1 = await seedServer({
    ownerId: owner1.id,
    name: "Aether Community",
  });

  const server2 = await seedServer({
    ownerId: owner2.id,
    name: "Aether Gaming",
  });

  const server3 = await seedServer({
    ownerId: owner1.id,
    name: "Aether Developer",
  });

  const role1 = await seedRole(server1.id);

  const role2 = await seedRole(server2.id);

  const role3 = await seedRole(server3.id);

  await seedServerMember({
    serverId: server1.id,
    userId: owner1.id,
    roleId: role1.id,
  });

  await seedServerMember({
    serverId: server2.id,
    userId: owner2.id,
    roleId: role2.id,
  });

  await seedServerMember({
    serverId: server3.id,
    userId: owner1.id,
    roleId: role3.id,
  });

  console.log("\nSemua Seeder berhasil dijalankan");

  console.log("\nOwner 1:");
  console.log(`Email: ${owner1.email}`);
  console.log(`Username: ${owner1.username}`);
  console.log(`Password: ${password}`);

  console.log("\nOwner 2:");
  console.log(`Email: ${owner2.email}`);
  console.log(`Username: ${owner2.username}`);
  console.log(`Password: ${password}`);

  console.log("\nMember:");
  console.log(`Email: ${member.email}`);
  console.log(`Username: ${member.username}`);
  console.log(`Password: ${password}`);

  console.log("\nServer 1:");
  console.log(`ID: ${server1.id}`);
  console.log(`Name: ${server1.name}`);
  console.log(`Owner: ${owner1.username}`);

  console.log("\nServer 2:");
  console.log(`ID: ${server2.id}`);
  console.log(`Name: ${server2.name}`);
  console.log(`Owner: ${owner2.username}`);

  console.log("\nServer 3:");
  console.log(`ID: ${server3.id}`);
  console.log(`Name: ${server3.name}`);
  console.log(`Owner: ${owner1.username}`);

  console.log("\nTesting Membership:");
  console.log(`Login menggunakan akun ${member.email} untuk mencoba endpoint join.`);
}

main()
  .catch((error) => {
    console.error("Seeder gagal dijalankan:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
