import { SubscriptionFrequency, SubscriptionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { AccountsRepository } from '../../accounts/repositories/accounts.repository';
import { CategoriesRepository } from '../../categories/repositories/categories.repository';
import { SubscriptionsRepository } from '../repositories/subscriptions.repository';
import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsService', () => {
  const userId = '11111111-1111-1111-1111-111111111111';
  let service: SubscriptionsService;
  let subscriptions: { findActiveByUser: jest.Mock };

  beforeEach(() => {
    subscriptions = {
      findActiveByUser: jest.fn().mockResolvedValue([
        {
          id: 'sub-1',
          userId,
          name: 'Netflix',
          amount: new Decimal('59.90'),
          frequency: SubscriptionFrequency.MONTHLY,
          nextChargeDate: new Date('2026-09-15T00:00:00.000Z'),
          status: SubscriptionStatus.ACTIVE,
          category: { icon: 'subscription', name: 'Assinatura' },
        },
        {
          id: 'sub-2',
          userId,
          name: 'Spotify',
          amount: new Decimal('21.90'),
          frequency: SubscriptionFrequency.MONTHLY,
          nextChargeDate: new Date('2026-09-21T00:00:00.000Z'),
          status: SubscriptionStatus.ACTIVE,
          category: { icon: 'subscription', name: 'Assinatura' },
        },
        {
          id: 'sub-3',
          userId,
          name: 'Amazon Prime',
          amount: new Decimal('19.90'),
          frequency: SubscriptionFrequency.MONTHLY,
          nextChargeDate: new Date('2026-09-28T00:00:00.000Z'),
          status: SubscriptionStatus.ACTIVE,
          category: { icon: 'subscription', name: 'Assinatura' },
        },
      ]),
    };

    service = new SubscriptionsService(
      subscriptions as unknown as SubscriptionsRepository,
      { findByIdAndUser: jest.fn() } as unknown as AccountsRepository,
      { findByIdAndUser: jest.fn() } as unknown as CategoriesRepository,
    );
  });

  it('sums monthly and yearly totals in cents', async () => {
    const result = await service.summary(userId);

    expect(result.monthlyCents).toBe('10170');
    expect(result.yearlyCents).toBe('122040');
    expect(result.items).toHaveLength(3);
    expect(result.items[0]).toMatchObject({
      name: 'Netflix',
      icon: 'play',
      tone: 'danger',
      nextDay: 15,
    });
  });
});
