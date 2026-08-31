import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OpenFinanceController } from './controllers/open-finance.controller';
import { OpenFinanceService } from './services/open-finance.service';

@Module({
  imports: [AuthModule],
  controllers: [OpenFinanceController],
  providers: [OpenFinanceService],
  exports: [OpenFinanceService],
})
export class OpenFinanceModule {}
