import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { UsersService } from '../../users/users.service';
import { DashboardRepository } from '../repositories/dashboard.repository';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  const userId = '11111111-1111-1111-1111-111111111111';

  it('aggregates home data into the mobile contract', async () => {
    const service = new DashboardService(
      {
        getSnapshot: jest.fn().mockResolvedValue({
          balance: new Decimal('8450'),
          monthTotals: [
            { type: TransactionType.INCOME, amount: new Decimal('12500') },
            { type: TransactionType.EXPENSE, amount: new Decimal('4050') },
          ],
          previousTotals: [{ type: TransactionType.EXPENSE, amount: new Decimal('3900') }],
          budgetTotal: new Decimal('6000'),
          recentIds: ['tx-1', 'tx-2', 'tx-3'],
          upcoming: [
            {
              id: 'sub-1',
              name: 'Aluguel',
              amount: new Decimal('1700'),
              nextChargeDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
              icon: 'homeCategory',
            },
          ],
          foodSpent: new Decimal('820'),
          previousFoodSpent: new Decimal('1000'),
        }),
      } as unknown as DashboardRepository,
      {
        findById: jest.fn().mockResolvedValue({ timezone: 'America/Sao_Paulo' }),
      } as unknown as UsersService,
    );

    const result = await service.get(userId);

    expect(result.balanceCents).toBe('845000');
    expect(result.incomeCents).toBe('1250000');
    expect(result.expenseCents).toBe('405000');
    expect(result.availableCents).toBe('845000');
    expect(result.spentLimitCents).toBe('600000');
    expect(result.recentTransactionIds).toEqual(['tx-1', 'tx-2', 'tx-3']);
    expect(result.insight.text).toContain('menos com alimentação');
    expect(result.upcoming[0]).toMatchObject({
      title: 'Aluguel',
      amountCents: '170000',
      icon: 'homeCategory',
    });
  });
});
