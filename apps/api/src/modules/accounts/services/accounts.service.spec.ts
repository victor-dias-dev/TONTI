import { AccountType, type Account } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { AccountsRepository } from '../repositories/accounts.repository';
import { AccountsService } from './accounts.service';
import { UsersService } from '../../users/users.service';

const account: Account = {
  id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  userId: '11111111-1111-1111-1111-111111111111',
  name: 'Nubank',
  type: AccountType.CHECKING,
  institution: null,
  initialBalance: new Decimal('4500'),
  currentBalance: new Decimal('4500'),
  creditLimit: null,
  closingDay: null,
  dueDay: null,
  brand: null,
  lastFour: null,
  isActive: true,
  createdAt: new Date('2026-08-01T00:00:00.000Z'),
  updatedAt: new Date('2026-08-01T00:00:00.000Z'),
};

describe('AccountsService', () => {
  let service: AccountsService;
  let repository: {
    findBankAccounts: jest.Mock;
    findByIdAndUser: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    countTransactions: jest.Mock;
  };

  beforeEach(() => {
    repository = {
      findBankAccounts: jest.fn().mockResolvedValue([account]),
      findByIdAndUser: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      countTransactions: jest.fn(),
    };

    service = new AccountsService(
      repository as unknown as AccountsRepository,
      { findById: jest.fn() } as unknown as UsersService,
    );
  });

  it('returns balances as integer cents strings', async () => {
    const result = await service.list(account.userId);
    expect(result[0]).toMatchObject({
      id: account.id,
      name: 'Nubank',
      kind: 'checking',
      balanceCents: '450000',
      icon: 'bank',
    });
  });

  it('creates a cash wallet when the user has no accounts', async () => {
    const wallet: Account = { ...account, name: 'Carteira', type: AccountType.CASH };
    repository.findBankAccounts.mockResolvedValueOnce([]);
    repository.create.mockResolvedValue(wallet);

    const result = await service.list(account.userId);

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: account.userId,
        name: 'Carteira',
        type: AccountType.CASH,
      }),
    );
    expect(result[0]).toMatchObject({ name: 'Carteira', kind: 'cash' });
  });

  it('deactivates accounts that still have transactions', async () => {
    repository.findByIdAndUser.mockResolvedValue(account);
    repository.countTransactions.mockResolvedValue(2);

    await service.remove(account.userId, account.id);

    expect(repository.update).toHaveBeenCalledWith(account.id, { isActive: false });
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('hides credit cards on the bank account endpoints', async () => {
    repository.findByIdAndUser.mockResolvedValue({ ...account, type: AccountType.CREDIT_CARD });

    await expect(service.getById(account.userId, account.id)).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });
});
