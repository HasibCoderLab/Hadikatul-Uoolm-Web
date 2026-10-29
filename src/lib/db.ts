import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { requireDatabaseUrl } from "@/lib/env";

const globalForPrisma = globalThis as typeof globalThis & {
  huPrisma?: PrismaClient;
};

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.huPrisma) {
    const adapter = new PrismaPg({ connectionString: requireDatabaseUrl() });
    globalForPrisma.huPrisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.huPrisma;
}
