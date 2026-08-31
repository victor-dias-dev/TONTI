import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { AuthModule } from '../auth/auth.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { CreditCardsController } from './controllers/credit-cards.controller';
import { CreditCardsService } from './services/credit-cards.service';

@Module({
  imports: [AuthModule, AccountsModule, TransactionsModule, UsersModule],
  controllers: [CreditCardsController],
  providers: [CreditCardsService],
  exports: [CreditCardsService],
})
export class CreditCardsModule {}
