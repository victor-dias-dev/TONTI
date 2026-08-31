import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { UsersModule } from '../users/users.module';
import { TransactionsController } from './controllers/transactions.controller';
import { PrismaTransactionsRepository } from './repositories/prisma-transactions.repository';
import { TransactionsRepository } from './repositories/transactions.repository';
import { TransactionsService } from './services/transactions.service';

@Module({
  imports: [AuthModule, AccountsModule, CategoriesModule, UsersModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    { provide: TransactionsRepository, useClass: PrismaTransactionsRepository },
  ],
  exports: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
