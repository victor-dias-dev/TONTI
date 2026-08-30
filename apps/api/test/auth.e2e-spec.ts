import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/setup-app';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  const userPayload = {
    name: 'Victor',
    email: 'victor@email.com',
    password: 'password',
  };

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
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  it('registers a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(userPayload)
      .expect(201);

    expect(response.body).toMatchObject({
      email: 'victor@email.com',
      name: 'Victor',
    });
    expect(response.body).not.toHaveProperty('passwordHash');
    expect(response.body.id).toEqual(expect.any(String));
  });

  it('rejects a duplicate email', async () => {
    await request(app.getHttpServer()).post('/api/v1/auth/register').send(userPayload).expect(201);

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(userPayload)
      .expect(409);

    expect(response.body.code).toBe('EMAIL_ALREADY_EXISTS');
    expect(response.body).toMatchObject({
      statusCode: 409,
      path: '/api/v1/auth/register',
    });
    expect(response.body.timestamp).toEqual(expect.any(String));
  });

  it('logs in with valid credentials', async () => {
    await request(app.getHttpServer()).post('/api/v1/auth/register').send(userPayload).expect(201);

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: userPayload.email, password: userPayload.password })
      .expect(200);

    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.tokenType).toBe('Bearer');
    expect(response.body.user).not.toHaveProperty('passwordHash');
  });

  it('rejects invalid credentials', async () => {
    await request(app.getHttpServer()).post('/api/v1/auth/register').send(userPayload).expect(201);

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: userPayload.email, password: 'wrongpass' })
      .expect(401);

    expect(response.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('returns the authenticated user on /me', async () => {
    await request(app.getHttpServer()).post('/api/v1/auth/register').send(userPayload).expect(201);

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: userPayload.email, password: userPayload.password })
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${login.body.accessToken as string}`)
      .expect(200);

    expect(response.body.email).toBe('victor@email.com');
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('rejects unauthorized /me requests', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);

    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('reports healthy dependencies', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.body).toEqual({
      status: 'ok',
      database: 'up',
      redis: 'up',
    });
  });
});
