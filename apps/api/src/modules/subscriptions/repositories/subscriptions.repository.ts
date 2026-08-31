import {
  Prisma,
  SubscriptionFrequency,
  SubscriptionStatus,
  type Category,
  type Subscription,
} from '@prisma/client';

export type SubscriptionWithCategory = Subscription & {
  category: Pick<Category, 'icon' | 'name'>;
};

export abstract class SubscriptionsRepository {
  abstract findActiveByUser(userId: string): Promise<SubscriptionWithCategory[]>;
  abstract findByIdAndUser(id: string, userId: string): Promise<SubscriptionWithCategory | null>;
  abstract create(data: {
    userId: string;
    accountId: string;
    categoryId: string;
    name: string;
    amount: Prisma.Decimal;
    frequency: SubscriptionFrequency;
    nextChargeDate: Date;
    status?: SubscriptionStatus;
  }): Promise<SubscriptionWithCategory>;
  abstract update(
    id: string,
    data: {
      name?: string;
      amount?: Prisma.Decimal;
      frequency?: SubscriptionFrequency;
      nextChargeDate?: Date;
      status?: SubscriptionStatus;
      accountId?: string;
      categoryId?: string;
    },
  ): Promise<SubscriptionWithCategory>;
  abstract delete(id: string): Promise<void>;
}
