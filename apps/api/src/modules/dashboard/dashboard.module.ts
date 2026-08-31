import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { DashboardController } from './controllers/dashboard.controller';
import { PrismaDashboardRepository } from './repositories/prisma-dashboard.repository';
import { DashboardRepository } from './repositories/dashboard.repository';
import { DashboardService } from './services/dashboard.service';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    { provide: DashboardRepository, useClass: PrismaDashboardRepository },
  ],
})
export class DashboardModule {}
