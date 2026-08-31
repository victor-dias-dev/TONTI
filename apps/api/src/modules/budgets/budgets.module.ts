import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { BudgetsController } from './controllers/budgets.controller';
import { PrismaBudgetsRepository } from './repositories/prisma-budgets.repository';
import { BudgetsRepository } from './repositories/budgets.repository';
import { BudgetsService } from './services/budgets.service';

@Module({
  imports: [AuthModule, TransactionsModule, CategoriesModule, UsersModule],
  controllers: [BudgetsController],
  providers: [BudgetsService, { provide: BudgetsRepository, useClass: PrismaBudgetsRepository }],
  exports: [BudgetsService, BudgetsRepository],
})
export class BudgetsModule {}
