import { Module } from '@nestjs/common';
import { PasswordService } from '../../common/security/password.service';
import { PrismaUsersRepository } from './repositories/prisma-users.repository';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';

@Module({
  providers: [
    UsersService,
    PasswordService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [UsersService, PasswordService],
})
export class UsersModule {}
