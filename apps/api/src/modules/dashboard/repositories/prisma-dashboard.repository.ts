import { Injectable } from '@nestjs/common';
import { AccountType, Prisma, TransactionStatus, TransactionType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { DashboardRepository, type DashboardSnapshot } from './dashboard.repository';

const BANK_TYPES: AccountType[] = [AccountType.CHECKING, AccountType.SAVINGS, AccountType.CASH];

@Injectable()
export class PrismaDashboardRepository extends DashboardRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async getSnapshot(
    userId: string,
    monthStart: Date,
    monthEnd: Date,
    previousStart: Date,
    upcomingFrom: Date,
    upcomingUntil: Date,
  ): Promise<DashboardSnapshot> {
    const monthDate = utcDateOnly(monthStart);

    const [balanceAgg, monthTotals, previousTotals, budgetAgg, recent, upcoming, foodCategory] =
      await Promise.all([
        this.prisma.account.aggregate({
          where: { userId, isActive: true, type: { in: BANK_TYPES } },
          _sum: { currentBalance: true },
        }),
        this.groupTotals(userId, monthStart, monthEnd),
        this.groupTotals(userId, previousStart, monthStart),
        this.prisma.budget.aggregate({
          where: { userId, month: monthDate },
          _sum: { amount: true },
        }),
        this.prisma.transaction.findMany({
          where: { userId, status: { not: TransactionStatus.CANCELLED } },
          orderBy: { date: 'desc' },
          take: 3,
          select: { id: true },
        }),
        this.prisma.subscription.findMany({
          where: {
            userId,
            status: 'ACTIVE',
            nextChargeDate: { gte: utcDateOnly(upcomingFrom), lte: utcDateOnly(upcomingUntil) },
          },
          include: { category: { select: { icon: true } } },
          orderBy: { nextChargeDate: 'asc' },
          take: 5,
        }),
        this.prisma.category.findFirst({
          where: { userId, name: 'Alimentação', type: 'EXPENSE' },
          select: { id: true },
        }),
      ]);

    let foodSpent = new Prisma.Decimal(0);
    let previousFoodSpent = new Prisma.Decimal(0);

    if (foodCategory) {
      const [currentFood, previousFood] = await Promise.all([
        this.sumCategory(userId, foodCategory.id, monthStart, monthEnd),
        this.sumCategory(userId, foodCategory.id, previousStart, monthStart),
      ]);
      foodSpent = currentFood;
      previousFoodSpent = previousFood;
    }

    return {
      balance: balanceAgg._sum.currentBalance ?? new Prisma.Decimal(0),
      monthTotals,
      previousTotals,
      budgetTotal: budgetAgg._sum.amount ?? new Prisma.Decimal(0),
      recentIds: recent.map((row) => row.id),
      upcoming: upcoming.map((row) => ({
        id: row.id,
        name: row.name,
        amount: row.amount,
        nextChargeDate: row.nextChargeDate,
        icon: row.category.icon,
      })),
      foodSpent,
      previousFoodSpent,
    };
  }

  private async groupTotals(userId: string, from: Date, to: Date) {
    const rows = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId,
        status: TransactionStatus.CONFIRMED,
        date: { gte: from, lt: to },
      },
      _sum: { amount: true },
    });

    return rows.map((row) => ({
      type: row.type,
      amount: row._sum.amount ?? new Prisma.Decimal(0),
    }));
  }

  private async sumCategory(userId: string, categoryId: string, from: Date, to: Date) {
    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        categoryId,
        type: TransactionType.EXPENSE,
        status: TransactionStatus.CONFIRMED,
        date: { gte: from, lt: to },
      },
      _sum: { amount: true },
    });
    return result._sum.amount ?? new Prisma.Decimal(0);
  }
}

function utcDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
