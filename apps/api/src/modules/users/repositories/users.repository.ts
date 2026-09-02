import type { ThemePreference, User } from '@prisma/client';

export type UserUpdate = {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
  passwordHash?: string;
  currency?: string;
  theme?: ThemePreference;
  hideBalances?: boolean;
  periodStartDay?: number;
  notificationsEnabled?: boolean;
  notifyBills?: boolean;
  notifyInvoices?: boolean;
  notifyBudgets?: boolean;
  notifyUnusual?: boolean;
  notifyGoals?: boolean;
  notifyLowBalance?: boolean;
};

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByEmailIncludingDeleted(email: string): Promise<User | null>;
  abstract create(data: { email: string; name: string; passwordHash: string }): Promise<User>;
  abstract update(id: string, data: UserUpdate): Promise<User>;
}
