import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { PrismaSubscriptionsRepository } from './repositories/prisma-subscriptions.repository';
import { SubscriptionsRepository } from './repositories/subscriptions.repository';
import { SubscriptionsService } from './services/subscriptions.service';

@Module({
  imports: [AuthModule, AccountsModule, CategoriesModule],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    { provide: SubscriptionsRepository, useClass: PrismaSubscriptionsRepository },
  ],
  exports: [SubscriptionsService, SubscriptionsRepository],
})
export class SubscriptionsModule {}
