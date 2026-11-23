import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { getApiEnvironment } from '../config/env.js';

let prisma: PrismaClient | undefined;

export function getPrismaClient(): PrismaClient {
  if (prisma) {
    return prisma;
  }

  const { DATABASE_URL } = getApiEnvironment();

  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL must be configured before accessing the database.');
  }

  prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: DATABASE_URL }),
  });

  return prisma;
}

export async function disconnectPrismaClient(): Promise<void> {
  if (!prisma) {
    return;
  }

  const currentClient = prisma;
  prisma = undefined;
  await currentClient.$disconnect();
}
