import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PreferencesController } from './controllers/preferences.controller';
import { PreferencesService } from './services/preferences.service';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [PreferencesController],
  providers: [PreferencesService],
})
export class PreferencesModule {}
