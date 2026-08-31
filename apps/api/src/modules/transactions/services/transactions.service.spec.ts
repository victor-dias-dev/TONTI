import { AccountType, TransactionType, type Account, type Transaction } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { AccountsRepository } from '../../accounts/repositories/accounts.repository';
import { CategoriesRepository } from '../../categories/repositories/categories.repository';
import { UsersService } from '../../users/users.service';
import { TransactionsRepository } from '../repositories/transactions.repository';
import { TransactionsService } from './transactions.service';

const account: Account = {
  id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  userId: '11111111-1111-1111-1111-111111111111',
  name: 'Nubank',
  type: AccountType.CHECKING,
  institution: null,
  initialBalance: new Decimal(0),
  currentBalance: new Decimal('4500'),
  creditLimit: null,
  closingDay: null,
  dueDay: null,
  brand: null,
  lastFour: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const transaction: Transaction & { account: { type: AccountType } } = {
  id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  userId: account.userId,
  accountId: account.id,
  categoryId: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
  type: TransactionType.EXPENSE,
  amount: new Decimal('45.90'),
  description: 'iFood',
  date: new Date('2026-08-30T15:30:00.000Z'),
  status: 'CONFIRMED',
  merchant: 'Almoço',
  transferId: null,
  installmentGroupId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  account: { type: AccountType.CHECKING },
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactions: {
    findByIdAndUser: jest.Mock;
    createLedgerEntry: jest.Mock;
    deleteLedgerEntry: jest.Mock;
  };
  let accounts: { findByIdAndUser: jest.Mock };
  let categories: { findByIdAndUser: jest.Mock };

  beforeEach(() => {
    transactions = {
      findByIdAndUser: jest.fn(),
      createLedgerEntry: jest.fn(),
      deleteLedgerEntry: jest.fn(),
    };
    accounts = { findByIdAndUser: jest.fn().mockResolvedValue(account) };
    categories = {
      findByIdAndUser: jest
        .fn()
        .mockResolvedValue({ id: transaction.categoryId, userId: account.userId }),
    };

    service = new TransactionsService(
      transactions as unknown as TransactionsRepository,
      accounts as unknown as AccountsRepository,
      categories as unknown as CategoriesRepository,
      { findById: jest.fn() } as unknown as UsersService,
    );
  });

  it('creates an expense and maps it to the mobile contract', async () => {
    transactions.createLedgerEntry.mockResolvedValue(transaction);

    const result = await service.create(account.userId, {
      description: 'iFood',
      amountCents: '4590',
      type: 'expense',
      categoryId: transaction.categoryId,
      accountId: account.id,
      notes: 'Almoço',
      occurredAt: '2026-08-30T12:30:00-03:00',
    });

    expect(result).toMatchObject({
      id: transaction.id,
      amountCents: '4590',
      type: 'expense',
      notes: 'Almoço',
    });
    expect(transactions.createLedgerEntry).toHaveBeenCalled();
  });

  it('rejects zero amounts', async () => {
    await expect(
      service.create(account.userId, {
        description: 'iFood',
        amountCents: '0',
        type: 'expense',
        categoryId: transaction.categoryId,
        accountId: account.id,
        occurredAt: '2026-08-30T12:30:00-03:00',
      }),
    ).rejects.toMatchObject({ code: ErrorCode.BUSINESS_RULE });
  });

  it('does not return another user transaction', async () => {
    transactions.findByIdAndUser.mockResolvedValue(null);

    try {
      await service.getById('other-user', transaction.id);
      fail('expected getById to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);
      expect((error as AppException).code).toBe(ErrorCode.NOT_FOUND);
    }
  });

  it('reverses the balance when deleting', async () => {
    transactions.findByIdAndUser.mockResolvedValue(transaction);

    await service.remove(account.userId, transaction.id);

    expect(transactions.deleteLedgerEntry).toHaveBeenCalled();
    const delta = transactions.deleteLedgerEntry.mock.calls[0][1] as Decimal;
    expect(delta.toFixed(4)).toBe('45.9000');
  });
});
