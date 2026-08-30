import type { User } from '@prisma/client';

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByEmailIncludingDeleted(email: string): Promise<User | null>;
  abstract create(data: { email: string; name: string; passwordHash: string }): Promise<User>;
}
