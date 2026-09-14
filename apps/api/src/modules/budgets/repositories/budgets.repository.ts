import { Prisma, type Budget } from '@prisma/client';

export abstract class BudgetsRepository {
  abstract findByUserAndMonth(userId: string, month: Date): Promise<Budget[]>;
  abstract findByIdAndUser(id: string, userId: string): Promise<Budget | null>;
  abstract findByUserCategoryMonth(
    userId: string,
    categoryId: string,
    month: Date,
  ): Promise<Budget | null>;
  abstract findLatestMonthBefore(userId: string, month: Date): Promise<Date | null>;
  abstract create(data: {
    userId: string;
    categoryId: string;
    month: Date;
    amount: Prisma.Decimal;
  }): Promise<Budget>;
  abstract createMany(
    data: Array<{
      userId: string;
      categoryId: string;
      month: Date;
      amount: Prisma.Decimal;
    }>,
  ): Promise<void>;
  abstract update(id: string, data: { amount?: Prisma.Decimal }): Promise<Budget>;
  abstract delete(id: string): Promise<void>;
}
