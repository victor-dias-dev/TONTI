import { Injectable } from '@nestjs/common';
import { AccountType, Prisma, TransactionStatus, TransactionType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AssistantRepository, type AssistantSnapshot } from './assistant.repository';

const BANK_TYPES: AccountType[] = [AccountType.CHECKING, AccountType.SAVINGS, AccountType.CASH];

@Injectable()
export class PrismaAssistantRepository extends AssistantRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async getSnapshot(
    userId: string,
    monthStart: Date,
    monthEnd: Date,
    previousStart: Date,
  ): Promise<AssistantSnapshot> {
    const monthDate = utcDateOnly(monthStart);

    const [balanceAgg, monthTotals, budgetAgg, foodCategory, currentCard, previousCard] =
      await Promise.all([
        this.prisma.account.aggregate({
          where: { userId, isActive: true, type: { in: BANK_TYPES } },
          _sum: { currentBalance: true },
        }),
        this.groupTotals(userId, monthStart, monthEnd),
        this.prisma.budget.aggregate({
          where: { userId, month: monthDate },
          _sum: { amount: true },
        }),
        this.prisma.category.findFirst({
          where: { userId, name: 'Alimentação', type: 'EXPENSE' },
          select: { id: true },
        }),
        this.sumCardExpenses(userId, monthStart, monthEnd),
        this.sumCardExpenses(userId, previousStart, monthStart),
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

    const income =
      monthTotals.find((row) => row.type === TransactionType.INCOME)?.amount ??
      new Prisma.Decimal(0);
    const expense =
      monthTotals.find((row) => row.type === TransactionType.EXPENSE)?.amount ??
      new Prisma.Decimal(0);
    const topExpense = await this.topExpense(userId, monthStart, monthEnd);

    return {
      foodSpent,
      previousFoodSpent,
      cardSpent: currentCard,
      previousCardSpent: previousCard,
      income,
      expense,
      planned: budgetAgg._sum.amount ?? new Prisma.Decimal(0),
      balance: balanceAgg._sum.currentBalance ?? new Prisma.Decimal(0),
      topExpense,
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

  private async sumCardExpenses(userId: string, from: Date, to: Date) {
    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.EXPENSE,
        status: TransactionStatus.CONFIRMED,
        date: { gte: from, lt: to },
        account: { type: AccountType.CREDIT_CARD },
      },
      _sum: { amount: true },
    });
    return result._sum.amount ?? new Prisma.Decimal(0);
  }

  private async topExpense(userId: string, from: Date, to: Date) {
    const rows = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: TransactionType.EXPENSE,
        status: TransactionStatus.CONFIRMED,
        date: { gte: from, lt: to },
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 1,
    });
    const top = rows[0];
    if (!top?._sum.amount) {
      return undefined;
    }
    const category = await this.prisma.category.findFirst({
      where: { id: top.categoryId, userId },
      select: { name: true },
    });
    return { name: category?.name ?? 'Outros', amount: top._sum.amount };
  }
}

function utcDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
