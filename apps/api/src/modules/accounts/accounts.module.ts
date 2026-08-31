import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AccountsController } from './controllers/accounts.controller';
import { PrismaAccountsRepository } from './repositories/prisma-accounts.repository';
import { AccountsRepository } from './repositories/accounts.repository';
import { AccountsService } from './services/accounts.service';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AccountsController],
  providers: [AccountsService, { provide: AccountsRepository, useClass: PrismaAccountsRepository }],
  exports: [AccountsService, AccountsRepository],
})
export class AccountsModule {}
