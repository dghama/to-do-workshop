import { getPrismaClient } from '../src/db/client.js';

const prisma = getPrismaClient();

try {
  await prisma.task.upsert({
    where: { id: '11111111-1111-4111-8111-111111111111' },
    update: {},
    create: {
      id: '11111111-1111-4111-8111-111111111111',
      title: 'Sample task',
    },
  });
} finally {
  await prisma.$disconnect();
}
