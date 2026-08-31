import type { SubscriptionsSummary } from '../domain';
import { subscriptionsSummary } from '../mocks/subscriptions';

export const subscriptionsService = {
  getSummary(): Promise<SubscriptionsSummary> {
    return Promise.resolve(subscriptionsSummary);
  },
};
