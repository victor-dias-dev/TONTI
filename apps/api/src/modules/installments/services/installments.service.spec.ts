import { Decimal } from '@prisma/client/runtime/library';
import { UsersService } from '../../users/users.service';
import { InstallmentsRepository } from '../repositories/installments.repository';
import { InstallmentsService } from './installments.service';

describe('InstallmentsService', () => {
  const userId = '11111111-1111-1111-1111-111111111111';
  const groupId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  let service: InstallmentsService;
  let installments: { findGrouped: jest.Mock; findGroup: jest.Mock };

  const row = (id: string, date: string, description: string) => ({
    id,
    userId,
    accountId: 'acc',
    categoryId: 'cat',
    installmentGroupId: groupId,
    amount: new Decimal('200'),
    description,
    merchant: 'Amazon',
    date: new Date(date),
    category: { icon: 'market' },
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-31T15:00:00.000Z'));

    installments = {
      findGrouped: jest
        .fn()
        .mockResolvedValue([
          row('t1', '2026-06-15T15:00:00.000Z', 'Amazon (1/4)'),
          row('t2', '2026-07-15T15:00:00.000Z', 'Amazon (2/4)'),
          row('t3', '2026-09-15T15:00:00.000Z', 'Amazon (3/4)'),
          row('t4', '2026-10-15T15:00:00.000Z', 'Amazon (4/4)'),
        ]),
      findGroup: jest.fn(),
    };

    service = new InstallmentsService(
      installments as unknown as InstallmentsRepository,
      {
        findById: jest.fn().mockResolvedValue({ timezone: 'America/Sao_Paulo' }),
      } as unknown as UsersService,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('groups ledger rows into a purchase with paid and remaining installments', async () => {
    const result = await service.list(userId);
    const plan = result[0];

    expect(plan?.id).toBe(groupId);
    expect(plan?.merchant).toBe('Amazon');
    expect(plan?.installmentCount).toBe(4);
    expect(plan?.installmentCents).toBe('20000');
    expect(plan?.totalCents).toBe('80000');
    expect(plan?.paidCount).toBe(2);
    expect(plan?.remainingCount).toBe(2);
    expect(plan?.remainingCents).toBe('40000');
    expect(plan?.installments.map((item) => item.status)).toEqual([
      'paid',
      'paid',
      'next',
      'upcoming',
    ]);
  });
});
