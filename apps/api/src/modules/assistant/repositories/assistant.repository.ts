import { Prisma } from '@prisma/client';

export interface AssistantSnapshot {
  foodSpent: Prisma.Decimal;
  previousFoodSpent: Prisma.Decimal;
  cardSpent: Prisma.Decimal;
  previousCardSpent: Prisma.Decimal;
  income: Prisma.Decimal;
  expense: Prisma.Decimal;
  planned: Prisma.Decimal;
  balance: Prisma.Decimal;
  topExpense?: { name: string; amount: Prisma.Decimal };
}

export abstract class AssistantRepository {
  abstract getSnapshot(
    userId: string,
    monthStart: Date,
    monthEnd: Date,
    previousStart: Date,
  ): Promise<AssistantSnapshot>;
}
