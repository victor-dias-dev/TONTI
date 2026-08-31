import { Injectable } from '@nestjs/common';
import { AccountType, Prisma, type Account, type Transaction } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AccountsRepository } from './accounts.repository';

const BANK_TYPES: AccountType[] = [AccountType.CHECKING, AccountType.SAVINGS, AccountType.CASH];

@Injectable()
export class PrismaAccountsRepository extends AccountsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  findBankAccounts(userId: string): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: { userId, isActive: true, type: { in: BANK_TYPES } },
      orderBy: { createdAt: 'asc' },
    });
  }

  findCreditCards(userId: string): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: { userId, isActive: true, type: AccountType.CREDIT_CARD },
      orderBy: { createdAt: 'asc' },
    });
  }

  findByIdAndUser(id: string, userId: string): Promise<Account | null> {
    return this.prisma.account.findFirst({ where: { id, userId } });
  }

  create(data: {
    userId: string;
    name: string;
    type: AccountType;
    initialBalance: Prisma.Decimal;
    currentBalance: Prisma.Decimal;
    institution?: string | null;
    creditLimit?: Prisma.Decimal | null;
    closingDay?: number | null;
    dueDay?: number | null;
    brand?: string | null;
    lastFour?: string | null;
  }): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  update(
    id: string,
    data: {
      name?: string;
      type?: AccountType;
      institution?: string | null;
      creditLimit?: Prisma.Decimal | null;
      closingDay?: number | null;
      dueDay?: number | null;
      brand?: string | null;
      lastFour?: string | null;
      isActive?: boolean;
    },
  ): Promise<Account> {
    return this.prisma.account.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.account.delete({ where: { id } });
  }

  countTransactions(id: string): Promise<number> {
    return this.prisma.transaction.count({ where: { accountId: id } });
  }

  findTransactions(accountId: string, userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { accountId, userId, status: { not: 'CANCELLED' } },
      orderBy: { date: 'desc' },
    });
  }

  findActivityTransactions(
    accountId: string,
    userId: string,
    from: Date,
  ): Promise<Array<Pick<Transaction, 'id' | 'amount' | 'type' | 'date'>>> {
    return this.prisma.transaction.findMany({
      where: { accountId, userId, status: 'CONFIRMED', date: { gte: from } },
      select: { id: true, amount: true, type: true, date: true },
      orderBy: { date: 'asc' },
    });
  }

  async sumBalances(userId: string, types: AccountType[]): Promise<Prisma.Decimal> {
    const result = await this.prisma.account.aggregate({
      where: { userId, isActive: true, type: { in: types } },
      _sum: { currentBalance: true },
    });
    return result._sum.currentBalance ?? new Prisma.Decimal(0);
  }
}
