import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AssistantController } from './controllers/assistant.controller';
import { PrismaAssistantRepository } from './repositories/prisma-assistant.repository';
import { AssistantRepository } from './repositories/assistant.repository';
import { AssistantService } from './services/assistant.service';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AssistantController],
  providers: [
    AssistantService,
    { provide: AssistantRepository, useClass: PrismaAssistantRepository },
  ],
  exports: [AssistantService],
})
export class AssistantModule {}
