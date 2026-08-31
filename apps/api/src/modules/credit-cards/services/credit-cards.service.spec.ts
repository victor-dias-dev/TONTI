import { AccountType, TransactionType, type Account } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { AccountsRepository } from '../../accounts/repositories/accounts.repository';
import { TransactionsRepository } from '../../transactions/repositories/transactions.repository';
import { UsersService } from '../../users/users.service';
import { CreditCardsService } from './credit-cards.service';

const card: Account = {
  id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  userId: '11111111-1111-1111-1111-111111111111',
  name: 'Inter Visa',
  type: AccountType.CREDIT_CARD,
  institution: 'Visa 4412',
  initialBalance: new Decimal(0),
  currentBalance: new Decimal('1850.40'),
  creditLimit: new Decimal('5000'),
  closingDay: 5,
  dueDay: 10,
  brand: 'Visa',
  lastFour: '4412',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreditCardsService', () => {
  let service: CreditCardsService;
  let transactions: { findConfirmedForAccounts: jest.Mock };

  beforeEach(() => {
    transactions = {
      findConfirmedForAccounts: jest.fn().mockResolvedValue([
        {
          id: 'tx-1',
          accountId: card.id,
          amount: new Decimal('1850.40'),
          type: TransactionType.EXPENSE,
          date: new Date(),
        },
      ]),
    };

    service = new CreditCardsService(
      {
        findCreditCards: jest.fn().mockResolvedValue([card]),
        findByIdAndUser: jest.fn().mockResolvedValue(card),
      } as unknown as AccountsRepository,
      transactions as unknown as TransactionsRepository,
      {
        findById: jest.fn().mockResolvedValue({ timezone: 'America/Sao_Paulo' }),
      } as unknown as UsersService,
    );
  });

  it('computes the current invoice without N+1 queries', async () => {
    const result = await service.list(card.userId);

    expect(transactions.findConfirmedForAccounts).toHaveBeenCalledTimes(1);
    expect(result[0]).toMatchObject({
      id: card.id,
      brand: 'Visa',
      lastDigits: '4412',
      limitCents: '500000',
    });
    expect(result[0].invoiceCents).toBe('185040');
  });

  it('hides another user credit card', async () => {
    const isolated = new CreditCardsService(
      { findByIdAndUser: jest.fn().mockResolvedValue(null) } as unknown as AccountsRepository,
      transactions as unknown as TransactionsRepository,
      { findById: jest.fn() } as unknown as UsersService,
    );

    await expect(isolated.getById('other-user', card.id)).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });
});
