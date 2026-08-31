import { Injectable } from '@nestjs/common';
import { Prisma, TransactionStatus, TransactionType, type Transaction } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import {
  TransactionsRepository,
  type TransactionListFilters,
  type TransactionWithAccount,
} from './transactions.repository';

const accountInclude = { account: { select: { type: true as const } } };

@Injectable()
export class PrismaTransactionsRepository extends TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  findMany(userId: string, filters: TransactionListFilters): Promise<TransactionWithAccount[]> {
    return this.prisma.transaction.findMany({
      where: this.where(userId, filters),
      include: accountInclude,
      orderBy: { date: 'desc' },
      skip: filters.skip,
      take: filters.take ?? 500,
    });
  }

  findByIdAndUser(id: string, userId: string): Promise<TransactionWithAccount | null> {
    return this.prisma.transaction.findFirst({
      where: { id, userId },
      include: accountInclude,
    });
  }

  findRecent(userId: string, take: number): Promise<TransactionWithAccount[]> {
    return this.prisma.transaction.findMany({
      where: { userId, status: { not: TransactionStatus.CANCELLED } },
      include: accountInclude,
      orderBy: { date: 'desc' },
      take,
    });
  }

  findRelated(
    userId: string,
    categoryId: string,
    excludeId: string,
    take: number,
  ): Promise<TransactionWithAccount[]> {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        categoryId,
        id: { not: excludeId },
        status: { not: TransactionStatus.CANCELLED },
      },
      include: accountInclude,
      orderBy: { date: 'desc' },
      take,
    });
  }

  findByCategory(userId: string, categoryId: string): Promise<TransactionWithAccount[]> {
    return this.prisma.transaction.findMany({
      where: { userId, categoryId, status: { not: TransactionStatus.CANCELLED } },
      include: accountInclude,
      orderBy: { date: 'desc' },
    });
  }

  findConfirmedForAccounts(
    userId: string,
    accountIds: string[],
    from: Date,
    to?: Date,
  ): Promise<Array<Pick<Transaction, 'id' | 'accountId' | 'amount' | 'type' | 'date'>>> {
    if (accountIds.length === 0) {
      return Promise.resolve([]);
    }

    return this.prisma.transaction.findMany({
      where: {
        userId,
        accountId: { in: accountIds },
        status: TransactionStatus.CONFIRMED,
        date: { gte: from, ...(to ? { lt: to } : {}) },
      },
      select: { id: true, accountId: true, amount: true, type: true, date: true },
      orderBy: { date: 'desc' },
    });
  }

  async sumByType(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<Array<{ type: TransactionType; amount: Prisma.Decimal }>> {
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

  async sumExpensesByCategory(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<Array<{ categoryId: string; amount: Prisma.Decimal }>> {
    const rows = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: TransactionType.EXPENSE,
        status: TransactionStatus.CONFIRMED,
        date: { gte: from, lt: to },
      },
      _sum: { amount: true },
    });

    return rows.map((row) => ({
      categoryId: row.categoryId,
      amount: row._sum.amount ?? new Prisma.Decimal(0),
    }));
  }

  createLedgerEntry(data: {
    userId: string;
    accountId: string;
    categoryId: string;
    type: TransactionType;
    amount: Prisma.Decimal;
    description: string;
    date: Date;
    merchant?: string | null;
    transferId?: string | null;
    installmentGroupId?: string | null;
    status?: TransactionStatus;
    balanceDelta: Prisma.Decimal;
  }): Promise<TransactionWithAccount> {
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.transaction.create({
        data: {
          userId: data.userId,
          accountId: data.accountId,
          categoryId: data.categoryId,
          type: data.type,
          amount: data.amount,
          description: data.description,
          date: data.date,
          merchant: data.merchant,
          transferId: data.transferId,
          installmentGroupId: data.installmentGroupId,
          status: data.status ?? TransactionStatus.CONFIRMED,
        },
        include: accountInclude,
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { currentBalance: { increment: data.balanceDelta } },
      });

      return created;
    });
  }

  createLedgerEntries(
    entries: Array<{
      userId: string;
      accountId: string;
      categoryId: string;
      type: TransactionType;
      amount: Prisma.Decimal;
      description: string;
      date: Date;
      merchant?: string | null;
      installmentGroupId: string;
      balanceDelta: Prisma.Decimal;
    }>,
  ): Promise<TransactionWithAccount[]> {
    return this.prisma.$transaction(async (tx) => {
      const created: TransactionWithAccount[] = [];

      for (const entry of entries) {
        const row = await tx.transaction.create({
          data: {
            userId: entry.userId,
            accountId: entry.accountId,
            categoryId: entry.categoryId,
            type: entry.type,
            amount: entry.amount,
            description: entry.description,
            date: entry.date,
            merchant: entry.merchant,
            installmentGroupId: entry.installmentGroupId,
          },
          include: accountInclude,
        });
        created.push(row);
      }

      const totalDelta = entries.reduce(
        (sum, entry) => sum.plus(entry.balanceDelta),
        new Prisma.Decimal(0),
      );

      const first = entries[0];
      if (!first) {
        return created;
      }

      await tx.account.update({
        where: { id: first.accountId },
        data: { currentBalance: { increment: totalDelta } },
      });

      return created;
    });
  }

  replaceLedgerEntry(
    current: TransactionWithAccount,
    next: {
      accountId: string;
      categoryId: string;
      type: TransactionType;
      amount: Prisma.Decimal;
      description: string;
      date: Date;
      merchant?: string | null;
      reverseDelta: Prisma.Decimal;
      applyDelta: Prisma.Decimal;
      nextAccountId: string;
    },
  ): Promise<TransactionWithAccount> {
    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: current.accountId },
        data: { currentBalance: { increment: next.reverseDelta } },
      });

      const updated = await tx.transaction.update({
        where: { id: current.id },
        data: {
          accountId: next.accountId,
          categoryId: next.categoryId,
          type: next.type,
          amount: next.amount,
          description: next.description,
          date: next.date,
          merchant: next.merchant,
        },
        include: accountInclude,
      });

      await tx.account.update({
        where: { id: next.nextAccountId },
        data: { currentBalance: { increment: next.applyDelta } },
      });

      return updated;
    });
  }

  async deleteLedgerEntry(
    current: TransactionWithAccount,
    reverseDelta: Prisma.Decimal,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: current.accountId },
        data: { currentBalance: { increment: reverseDelta } },
      });
      await tx.transaction.delete({ where: { id: current.id } });
    });
  }

  private where(userId: string, filters: TransactionListFilters): Prisma.TransactionWhereInput {
    return {
      userId,
      status: { not: TransactionStatus.CANCELLED },
      ...(filters.from || filters.to ? { date: { gte: filters.from, lt: filters.to } } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.accountId ? { accountId: filters.accountId } : {}),
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.q
        ? {
            OR: [
              { description: { contains: filters.q, mode: 'insensitive' } },
              { merchant: { contains: filters.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
  }
}
