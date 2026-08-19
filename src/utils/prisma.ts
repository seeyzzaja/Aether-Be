import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { config } from "#config/env";
import { PrismaClient } from "../prisma/generated/prisma/client.js";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: config.DATABASE_URL,
  });

const adapter = new PrismaPg(pool);

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
  await pool.end();
}

export default prisma;
