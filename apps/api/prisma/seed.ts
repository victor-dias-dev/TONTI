import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@tonti.app';
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return;
  }

  await prisma.user.create({
    data: {
      email,
      name: 'Demo',
      passwordHash: await argon2.hash('Demo1234!'),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
