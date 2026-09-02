import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { CreditCardsModule } from './modules/credit-cards/credit-cards.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PreferencesModule } from './modules/preferences/preferences.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { InstallmentsModule } from './modules/installments/installments.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
      validate: validateEnv,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            genReqId: (req: IncomingMessage, res: ServerResponse) => {
              const header = req.headers['x-request-id'];
              const id = typeof header === 'string' && header.length > 0 ? header : randomUUID();
              res.setHeader('x-request-id', id);
              return id;
            },
            autoLogging: {
              ignore: (req: IncomingMessage) => req.url === '/health',
            },
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'req.body.password',
                'password',
                'passwordHash',
                '*.password',
                '*.passwordHash',
                'accessToken',
                '*.accessToken',
              ],
              censor: '[REDACTED]',
            },
            serializers: {
              req: (req: IncomingMessage & { id?: string }) => ({
                id: req.id,
                method: req.method,
                url: req.url,
              }),
            },
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: { colorize: true, singleLine: true },
                },
          },
        };
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', ttl: 60_000, limit: 60 }],
    }),
    DatabaseModule,
    RedisModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    AccountsModule,
    TransactionsModule,
    BudgetsModule,
    CreditCardsModule,
    DashboardModule,
    ProfileModule,
    PreferencesModule,
    SubscriptionsModule,
    InstallmentsModule,
    AssistantModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
