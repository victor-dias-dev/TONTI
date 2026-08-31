import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import type { PublicUser } from '@tonti/types';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  findByEmailIncludingDeleted(email: string): Promise<User | null> {
    return this.usersRepository.findByEmailIncludingDeleted(email);
  }

  create(data: { email: string; name: string; passwordHash: string }): Promise<User> {
    return this.usersRepository.create(data);
  }

  update(id: string, data: { name?: string; avatarUrl?: string | null }): Promise<User> {
    return this.usersRepository.update(id, data);
  }

  toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
