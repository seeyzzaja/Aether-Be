import "dotenv/config";

import { hashPassword } from "#utils/password";
import prisma from "#utils/prisma";

const defaultPassword = process.env.SEED_USER_PASSWORD || "Password123!";

const users = [
  {
    email: process.env.SEED_OWNER_1_EMAIL || "owner1@aether.test",
    username: process.env.SEED_OWNER_1_USERNAME || "aether_owner_1",
  },
  {
    email: process.env.SEED_OWNER_2_EMAIL || "owner2@aether.test",
    username: process.env.SEED_OWNER_2_USERNAME || "aether_owner_2",
  },
  {
    email: process.env.SEED_MEMBER_EMAIL || "member@aether.test",
    username: process.env.SEED_MEMBER_USERNAME || "aether_member",
  },
];

export async function seedUser() {
  console.log("🌱 Seeding Users...");

  const passwordHash = await hashPassword(defaultPassword);

  const seededUsers = await Promise.all(
    users.map((user) =>
      prisma.user.upsert({
        where: {
          email: user.email,
        },
        update: {
          username: user.username,
          passwordHash,
          deletedAt: null,
        },
        create: {
          email: user.email,
          username: user.username,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          username: true,
        },
      }),
    ),
  );

  console.log("✅ 3 Users berhasil dibuat");

  return {
    owner1: seededUsers[0],
    owner2: seededUsers[1],
    member: seededUsers[2],
    password: defaultPassword,
  };
}
