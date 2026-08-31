import { AccountType, Prisma, TransactionType } from '@prisma/client';

export interface DashboardSnapshot {
  balance: Prisma.Decimal;
  monthTotals: Array<{ type: TransactionType; amount: Prisma.Decimal }>;
  previousTotals: Array<{ type: TransactionType; amount: Prisma.Decimal }>;
  budgetTotal: Prisma.Decimal;
  recentIds: string[];
  upcoming: Array<{
    id: string;
    name: string;
    amount: Prisma.Decimal;
    nextChargeDate: Date;
    icon: string;
  }>;
  foodSpent: Prisma.Decimal;
  previousFoodSpent: Prisma.Decimal;
}

export abstract class DashboardRepository {
  abstract getSnapshot(
    userId: string,
    monthStart: Date,
    monthEnd: Date,
    previousStart: Date,
    upcomingFrom: Date,
    upcomingUntil: Date,
  ): Promise<DashboardSnapshot>;
}
