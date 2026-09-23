import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/setup-app';

describe('Data isolation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  beforeEach(async () => {
    await clearFinanceData(prisma);
  });

  afterAll(async () => {
    await clearFinanceData(prisma);
    await prisma.$disconnect();
    await app.close();
  });

  it('hides another user transaction and account', async () => {
    const { tokenA, tokenB, accountId, transactionId } = await seedOwnedExpense(app);

    const ownList = await request(app.getHttpServer())
      .get('/api/v1/transactions')
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    expect(ownList.body.map((row: { id: string }) => row.id)).toContain(transactionId);

    const otherList = await request(app.getHttpServer())
      .get('/api/v1/transactions')
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);

    expect(otherList.body.map((row: { id: string }) => row.id)).not.toContain(transactionId);

    const hiddenTransaction = await request(app.getHttpServer())
      .get(`/api/v1/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(404);

    expect(hiddenTransaction.body.code).toBe('NOT_FOUND');

    const hiddenAccount = await request(app.getHttpServer())
      .get(`/api/v1/accounts/${accountId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(404);

    expect(hiddenAccount.body.code).toBe('NOT_FOUND');
  });

  it('rejects a transaction that references another user account or category', async () => {
    const { tokenB, accountId, categoryId } = await seedOwnedExpense(app);

    const accounts = await request(app.getHttpServer())
      .get('/api/v1/accounts')
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);
    const categories = await request(app.getHttpServer())
      .get('/api/v1/categories')
      .query({ type: 'expense' })
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);

    const ownAccountId = accounts.body[0].id as string;
    const ownCategoryId = categories.body[0].id as string;

    const foreignAccount = await request(app.getHttpServer())
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${tokenB}`)
      .send(expenseBody(accountId, ownCategoryId))
      .expect(404);

    expect(foreignAccount.body.code).toBe('NOT_FOUND');

    const foreignCategory = await request(app.getHttpServer())
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${tokenB}`)
      .send(expenseBody(ownAccountId, categoryId))
      .expect(404);

    expect(foreignCategory.body.code).toBe('NOT_FOUND');
  });
});

async function clearFinanceData(prisma: PrismaClient) {
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.account.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

async function registerAndLogin(
  app: INestApplication,
  user: { name: string; email: string; password: string },
) {
  await request(app.getHttpServer()).post('/api/v1/auth/register').send(user).expect(201);

  const login = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email: user.email, password: user.password })
    .expect(200);

  return login.body.accessToken as string;
}

function expenseBody(accountId: string, categoryId: string) {
  return {
    description: 'Almoço',
    amountCents: '4590',
    type: 'expense',
    categoryId,
    accountId,
    occurredAt: new Date().toISOString(),
  };
}

async function seedOwnedExpense(app: INestApplication) {
  const tokenA = await registerAndLogin(app, {
    name: 'User A',
    email: 'a@tonti.test',
    password: 'password1',
  });
  const tokenB = await registerAndLogin(app, {
    name: 'User B',
    email: 'b@tonti.test',
    password: 'password1',
  });

  const accounts = await request(app.getHttpServer())
    .get('/api/v1/accounts')
    .set('Authorization', `Bearer ${tokenA}`)
    .expect(200);
  const categories = await request(app.getHttpServer())
    .get('/api/v1/categories')
    .query({ type: 'expense' })
    .set('Authorization', `Bearer ${tokenA}`)
    .expect(200);

  const accountId = accounts.body[0].id as string;
  const categoryId = categories.body[0].id as string;

  const created = await request(app.getHttpServer())
    .post('/api/v1/transactions')
    .set('Authorization', `Bearer ${tokenA}`)
    .send(expenseBody(accountId, categoryId))
    .expect(201);

  return {
    tokenA,
    tokenB,
    accountId,
    categoryId,
    transactionId: created.body.id as string,
  };
}
