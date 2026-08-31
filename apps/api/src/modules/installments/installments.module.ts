import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { InstallmentsController } from './controllers/installments.controller';
import { PrismaInstallmentsRepository } from './repositories/prisma-installments.repository';
import { InstallmentsRepository } from './repositories/installments.repository';
import { InstallmentsService } from './services/installments.service';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [InstallmentsController],
  providers: [
    InstallmentsService,
    { provide: InstallmentsRepository, useClass: PrismaInstallmentsRepository },
  ],
  exports: [InstallmentsService, InstallmentsRepository],
})
export class InstallmentsModule {}
