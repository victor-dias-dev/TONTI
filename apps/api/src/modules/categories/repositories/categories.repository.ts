import type { Category, CategoryType } from '@prisma/client';

export abstract class CategoriesRepository {
  abstract findByUser(userId: string, type?: CategoryType): Promise<Category[]>;
  abstract findByIdAndUser(id: string, userId: string): Promise<Category | null>;
  abstract findByNameAndType(
    userId: string,
    name: string,
    type: CategoryType,
  ): Promise<Category | null>;
  abstract create(data: {
    userId: string;
    name: string;
    type: CategoryType;
    icon: string;
    color: string;
    isSystem?: boolean;
  }): Promise<Category>;
  abstract update(
    id: string,
    data: { name?: string; icon?: string; color?: string },
  ): Promise<Category>;
  abstract delete(id: string): Promise<void>;
  abstract countUsage(id: string): Promise<{ transactions: number; budgets: number }>;
  abstract countTransactionsInRange(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<Array<{ categoryId: string; count: number }>>;
}
