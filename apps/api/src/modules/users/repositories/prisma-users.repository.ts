import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { DEFAULT_CATEGORIES } from '../../../common/catalog/default-categories';
import { DEFAULT_ACCOUNTS } from '../../../common/catalog/default-accounts';
import { PrismaService } from '../../../database/prisma.service';
import { UsersRepository, type UserUpdate } from './users.repository';

@Injectable()
export class PrismaUsersRepository extends UsersRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  findByEmailIncludingDeleted(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  create(data: { email: string; name: string; passwordHash: string }): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        categories: { create: DEFAULT_CATEGORIES },
        accounts: { create: DEFAULT_ACCOUNTS },
      },
    });
  }

  update(id: string, data: UserUpdate): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
