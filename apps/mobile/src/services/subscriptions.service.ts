import type { SubscriptionsSummary } from '../domain';
import { financeApi } from '../api/finance';
import { asIconName } from '../utils/lookups';

export const subscriptionsService = {
  getSummary(): Promise<SubscriptionsSummary> {
    return financeApi.getSubscriptions().then(mapSummary);
  },

  create(payload: {
    name: string;
    amountCents: string;
    accountId: string;
    categoryId: string;
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    nextChargeDate: string;
  }) {
    return financeApi.createSubscription(payload).then((item) => ({
      ...item,
      icon: asIconName(item.icon, 'subscription'),
    }));
  },
};

function mapSummary(summary: SubscriptionsSummary): SubscriptionsSummary {
  return {
    ...summary,
    items: summary.items.map((item) => ({
      ...item,
      icon: asIconName(item.icon, 'subscription'),
    })),
  };
}
