import { AccountType, Prisma, type Account, type Transaction } from '@prisma/client';

export abstract class AccountsRepository {
  abstract findBankAccounts(userId: string): Promise<Account[]>;
  abstract findCreditCards(userId: string): Promise<Account[]>;
  abstract findByIdAndUser(id: string, userId: string): Promise<Account | null>;
  abstract create(data: {
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
  }): Promise<Account>;
  abstract update(
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
  ): Promise<Account>;
  abstract delete(id: string): Promise<void>;
  abstract countTransactions(id: string): Promise<number>;
  abstract findTransactions(accountId: string, userId: string): Promise<Transaction[]>;
  abstract findActivityTransactions(
    accountId: string,
    userId: string,
    from: Date,
  ): Promise<Array<Pick<Transaction, 'id' | 'amount' | 'type' | 'date'>>>;
  abstract sumBalances(userId: string, types: AccountType[]): Promise<Prisma.Decimal>;
}
