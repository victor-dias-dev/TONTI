import { Injectable } from '@nestjs/common';
import { Prisma, SubscriptionFrequency, SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { SubscriptionsRepository, type SubscriptionWithCategory } from './subscriptions.repository';

const categoryInclude = { category: { select: { icon: true, name: true } } };

@Injectable()
export class PrismaSubscriptionsRepository extends SubscriptionsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  findActiveByUser(userId: string): Promise<SubscriptionWithCategory[]> {
    return this.prisma.subscription.findMany({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      include: categoryInclude,
      orderBy: { nextChargeDate: 'asc' },
    });
  }

  findByIdAndUser(id: string, userId: string): Promise<SubscriptionWithCategory | null> {
    return this.prisma.subscription.findFirst({
      where: { id, userId },
      include: categoryInclude,
    });
  }

  create(data: {
    userId: string;
    accountId: string;
    categoryId: string;
    name: string;
    amount: Prisma.Decimal;
    frequency: SubscriptionFrequency;
    nextChargeDate: Date;
    status?: SubscriptionStatus;
  }): Promise<SubscriptionWithCategory> {
    return this.prisma.subscription.create({
      data,
      include: categoryInclude,
    });
  }

  update(
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
  ): Promise<SubscriptionWithCategory> {
    return this.prisma.subscription.update({
      where: { id },
      data,
      include: categoryInclude,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subscription.delete({ where: { id } });
  }
}
