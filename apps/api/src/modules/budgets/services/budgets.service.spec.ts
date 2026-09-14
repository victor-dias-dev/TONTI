import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { CategoriesRepository } from '../../categories/repositories/categories.repository';
import { TransactionsRepository } from '../../transactions/repositories/transactions.repository';
import { UsersService } from '../../users/users.service';
import { BudgetsRepository } from '../repositories/budgets.repository';
import { BudgetsService } from './budgets.service';

describe('BudgetsService', () => {
  const userId = '11111111-1111-1111-1111-111111111111';
  const categoryId = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

  let service: BudgetsService;
  let budgets: {
    findByUserAndMonth: jest.Mock;
    findByIdAndUser: jest.Mock;
    findLatestMonthBefore: jest.Mock;
    createMany: jest.Mock;
  };
  let transactions: { sumByType: jest.Mock; sumExpensesByCategory: jest.Mock };

  beforeEach(() => {
    budgets = {
      findByUserAndMonth: jest.fn().mockResolvedValue([
        {
          id: 'budget-1',
          userId,
          categoryId,
          month: new Date('2026-08-01'),
          amount: new Decimal('2000'),
        },
      ]),
      findByIdAndUser: jest.fn(),
      findLatestMonthBefore: jest.fn(),
      createMany: jest.fn(),
    };
    transactions = {
      sumByType: jest
        .fn()
        .mockResolvedValue([{ type: TransactionType.INCOME, amount: new Decimal('12500') }]),
      sumExpensesByCategory: jest
        .fn()
        .mockResolvedValue([{ categoryId, amount: new Decimal('1700') }]),
    };

    service = new BudgetsService(
      budgets as unknown as BudgetsRepository,
      transactions as unknown as TransactionsRepository,
      { findByIdAndUser: jest.fn() } as unknown as CategoriesRepository,
      {
        findById: jest.fn().mockResolvedValue({ timezone: 'America/Sao_Paulo' }),
      } as unknown as UsersService,
    );
  });

  it('computes spent, remaining and percent on the backend', async () => {
    const result = await service.summary(userId, '2026-08');

    expect(result.incomeCents).toBe('1250000');
    expect(result.plannedCents).toBe('200000');
    expect(result.remainingCents).toBe('30000');
    expect(result.budgets[0]).toMatchObject({
      spentCents: '170000',
      percentLabel: '85%',
      status: 'warning',
    });
  });

  it('marks a category as over budget', async () => {
    transactions.sumExpensesByCategory.mockResolvedValue([
      { categoryId, amount: new Decimal('2200') },
    ]);

    const result = await service.summary(userId, '2026-08');
    expect(result.budgets[0].status).toBe('over');
    expect(result.budgets[0].percentLabel).toBe('110%');
  });

  it('renews last month plans with spent starting at zero', async () => {
    const previous = [
      {
        id: 'budget-prev',
        userId,
        categoryId,
        month: new Date('2026-08-01'),
        amount: new Decimal('1700'),
      },
    ];
    const renewed = [
      {
        id: 'budget-sep',
        userId,
        categoryId,
        month: new Date('2026-09-01'),
        amount: new Decimal('1700'),
      },
    ];
    budgets.findByUserAndMonth
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(previous)
      .mockResolvedValueOnce(renewed);
    budgets.findLatestMonthBefore.mockResolvedValue(new Date('2026-08-01'));
    transactions.sumExpensesByCategory.mockResolvedValue([]);

    const result = await service.summary(userId, '2026-09');

    expect(budgets.createMany).toHaveBeenCalledWith([
      expect.objectContaining({
        userId,
        categoryId,
        month: new Date('2026-09-01'),
        amount: new Decimal('1700'),
      }),
    ]);
    expect(result.budgets[0]).toMatchObject({
      plannedCents: '170000',
      spentCents: '0',
      percentLabel: '0%',
    });
  });
});
