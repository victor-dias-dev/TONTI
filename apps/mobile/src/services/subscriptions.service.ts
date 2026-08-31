import type { SubscriptionsSummary } from '../domain';
import { financeApi } from '../api/finance';

export const subscriptionsService = {
  getSummary(): Promise<SubscriptionsSummary> {
    return financeApi.getSubscriptions();
  },
};
