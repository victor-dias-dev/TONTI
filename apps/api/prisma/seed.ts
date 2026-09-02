import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { DEFAULT_CATEGORIES } from '../src/common/catalog/default-categories';
import { DEFAULT_ACCOUNTS } from '../src/common/catalog/default-accounts';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@tonti.app';
  const passwordHash = await argon2.hash('Demo1234!');

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: 'Victor', passwordHash, deletedAt: null },
    create: {
      email,
      name: 'Victor',
      passwordHash,
      categories: { create: DEFAULT_CATEGORIES },
      accounts: { create: DEFAULT_ACCOUNTS },
    },
  });

  const categoryCount = await prisma.category.count({ where: { userId: user.id } });
  if (categoryCount === 0) {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((category) => ({ ...category, userId: user.id })),
    });
  }

  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.budget.deleteMany({ where: { userId: user.id } });
  await prisma.subscription.deleteMany({ where: { userId: user.id } });
  await prisma.account.deleteMany({ where: { userId: user.id } });
  await prisma.account.createMany({
    data: DEFAULT_ACCOUNTS.map((account) => ({ ...account, userId: user.id })),
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
