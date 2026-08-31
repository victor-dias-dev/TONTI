import {
  Prisma,
  TransactionStatus,
  TransactionType,
  type Account,
  type Transaction,
} from '@prisma/client';

export type TransactionWithAccount = Transaction & { account: Pick<Account, 'type'> };

export interface TransactionListFilters {
  from?: Date;
  to?: Date;
  categoryId?: string;
  accountId?: string;
  type?: TransactionType;
  q?: string;
  skip?: number;
  take?: number;
}

export abstract class TransactionsRepository {
  abstract findMany(
    userId: string,
    filters: TransactionListFilters,
  ): Promise<TransactionWithAccount[]>;
  abstract findByIdAndUser(id: string, userId: string): Promise<TransactionWithAccount | null>;
  abstract findRecent(userId: string, take: number): Promise<TransactionWithAccount[]>;
  abstract findRelated(
    userId: string,
    categoryId: string,
    excludeId: string,
    take: number,
  ): Promise<TransactionWithAccount[]>;
  abstract findByCategory(userId: string, categoryId: string): Promise<TransactionWithAccount[]>;
  abstract findConfirmedForAccounts(
    userId: string,
    accountIds: string[],
    from: Date,
    to?: Date,
  ): Promise<Array<Pick<Transaction, 'id' | 'accountId' | 'amount' | 'type' | 'date'>>>;
  abstract sumByType(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<Array<{ type: TransactionType; amount: Prisma.Decimal }>>;
  abstract sumExpensesByCategory(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<Array<{ categoryId: string; amount: Prisma.Decimal }>>;
  abstract createLedgerEntry(data: {
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
  }): Promise<TransactionWithAccount>;
  abstract createLedgerEntries(
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
  ): Promise<TransactionWithAccount[]>;
  abstract replaceLedgerEntry(
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
  ): Promise<TransactionWithAccount>;
  abstract deleteLedgerEntry(
    current: TransactionWithAccount,
    reverseDelta: Prisma.Decimal,
  ): Promise<void>;
}
