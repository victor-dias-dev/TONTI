import { HttpStatus, Injectable } from '@nestjs/common';
import { SubscriptionFrequency, SubscriptionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { centsToDecimal, decimalToCents, sumDecimals } from '../../../common/money/money';
import { AccountsRepository } from '../../accounts/repositories/accounts.repository';
import { CategoriesRepository } from '../../categories/repositories/categories.repository';
import type { CreateSubscriptionDto, UpdateSubscriptionDto } from '../dto/create-subscription.dto';
import type {
  SubscriptionItemDto,
  SubscriptionsSummaryDto,
} from '../dto/subscription-response.dto';
import {
  SubscriptionsRepository,
  type SubscriptionWithCategory,
} from '../repositories/subscriptions.repository';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly accountsRepository: AccountsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async summary(userId: string): Promise<SubscriptionsSummaryDto> {
    const rows = await this.subscriptionsRepository.findActiveByUser(userId);
    const items = rows.map((row) => this.toItem(row));
    const yearly = sumDecimals(rows.map((row) => yearlyAmount(row.amount, row.frequency)));
    const monthly = sumDecimals(rows.map((row) => monthlyAmount(row.amount, row.frequency)));
    const yearlyCents = decimalToCents(yearly);

    return {
      insightYearlyCents: yearlyCents,
      monthlyCents: decimalToCents(monthly),
      yearlyCents,
      items,
    };
  }

  async getById(userId: string, id: string): Promise<SubscriptionItemDto> {
    const row = await this.subscriptionsRepository.findByIdAndUser(id, userId);
    if (!row) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
        'Assinatura não encontrada',
      );
    }
    return this.toItem(row);
  }

  async create(userId: string, dto: CreateSubscriptionDto): Promise<SubscriptionItemDto> {
    await this.requireAccount(userId, dto.accountId);
    await this.requireCategory(userId, dto.categoryId);
    const amount = this.requirePositive(dto.amountCents);
    const created = await this.subscriptionsRepository.create({
      userId,
      accountId: dto.accountId,
      categoryId: dto.categoryId,
      name: dto.name.trim(),
      amount,
      frequency: fromApiFrequency(dto.frequency),
      nextChargeDate: dateOnly(dto.nextChargeDate),
    });
    return this.toItem(created);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateSubscriptionDto,
  ): Promise<SubscriptionItemDto> {
    const current = await this.subscriptionsRepository.findByIdAndUser(id, userId);
    if (!current) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
        'Assinatura não encontrada',
      );
    }
    if (dto.accountId) {
      await this.requireAccount(userId, dto.accountId);
    }
    if (dto.categoryId) {
      await this.requireCategory(userId, dto.categoryId);
    }

    const updated = await this.subscriptionsRepository.update(id, {
      name: dto.name?.trim(),
      amount: dto.amountCents ? this.requirePositive(dto.amountCents) : undefined,
      frequency: dto.frequency ? fromApiFrequency(dto.frequency) : undefined,
      nextChargeDate: dto.nextChargeDate ? dateOnly(dto.nextChargeDate) : undefined,
      status: dto.status ? fromApiStatus(dto.status) : undefined,
      accountId: dto.accountId,
      categoryId: dto.categoryId,
    });
    return this.toItem(updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    const current = await this.subscriptionsRepository.findByIdAndUser(id, userId);
    if (!current) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
        'Assinatura não encontrada',
      );
    }
    await this.subscriptionsRepository.delete(id);
  }

  private toItem(row: SubscriptionWithCategory): SubscriptionItemDto {
    const presentation = subscriptionPresentation(row.name, row.category.icon);
    return {
      id: row.id,
      name: row.name,
      amountCents: decimalToCents(row.amount),
      nextDay: row.nextChargeDate.getUTCDate(),
      icon: presentation.icon,
      tone: presentation.tone,
      frequency: toApiFrequency(row.frequency),
      status: toApiStatus(row.status),
    };
  }

  private requirePositive(cents: string): Decimal {
    const amount = centsToDecimal(cents);
    if (amount.lte(0)) {
      throw new AppException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.BUSINESS_RULE,
        'O valor deve ser maior que zero',
      );
    }
    return amount;
  }

  private async requireAccount(userId: string, id: string) {
    const account = await this.accountsRepository.findByIdAndUser(id, userId);
    if (!account || !account.isActive) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Conta não encontrada');
    }
  }

  private async requireCategory(userId: string, id: string) {
    const category = await this.categoriesRepository.findByIdAndUser(id, userId);
    if (!category) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Categoria não encontrada');
    }
  }
}

function yearlyAmount(amount: Decimal, frequency: SubscriptionFrequency): Decimal {
  switch (frequency) {
    case SubscriptionFrequency.WEEKLY:
      return amount.mul(52);
    case SubscriptionFrequency.QUARTERLY:
      return amount.mul(4);
    case SubscriptionFrequency.YEARLY:
      return amount;
    default:
      return amount.mul(12);
  }
}

function monthlyAmount(amount: Decimal, frequency: SubscriptionFrequency): Decimal {
  switch (frequency) {
    case SubscriptionFrequency.WEEKLY:
      return amount.mul(52).div(12);
    case SubscriptionFrequency.QUARTERLY:
      return amount.mul(4).div(12);
    case SubscriptionFrequency.YEARLY:
      return amount.div(12);
    default:
      return amount;
  }
}

function dateOnly(input: string): Date {
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    const date = new Date(input);
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

function subscriptionPresentation(
  name: string,
  categoryIcon: string,
): { icon: string; tone: 'danger' | 'soft' | 'muted' } {
  const normalized = name.toLowerCase();
  if (normalized.includes('netflix')) {
    return { icon: 'play', tone: 'danger' };
  }
  if (normalized.includes('spotify')) {
    return { icon: 'music', tone: 'soft' };
  }
  if (normalized.includes('amazon') || normalized.includes('prime')) {
    return { icon: 'truck', tone: 'muted' };
  }
  return { icon: categoryIcon || 'subscription', tone: 'muted' };
}

function toApiFrequency(frequency: SubscriptionFrequency): SubscriptionItemDto['frequency'] {
  switch (frequency) {
    case SubscriptionFrequency.WEEKLY:
      return 'weekly';
    case SubscriptionFrequency.QUARTERLY:
      return 'quarterly';
    case SubscriptionFrequency.YEARLY:
      return 'yearly';
    default:
      return 'monthly';
  }
}

function fromApiFrequency(frequency: CreateSubscriptionDto['frequency']): SubscriptionFrequency {
  switch (frequency) {
    case 'weekly':
      return SubscriptionFrequency.WEEKLY;
    case 'quarterly':
      return SubscriptionFrequency.QUARTERLY;
    case 'yearly':
      return SubscriptionFrequency.YEARLY;
    default:
      return SubscriptionFrequency.MONTHLY;
  }
}

function toApiStatus(status: SubscriptionStatus): SubscriptionItemDto['status'] {
  switch (status) {
    case SubscriptionStatus.PAUSED:
      return 'paused';
    case SubscriptionStatus.CANCELLED:
      return 'cancelled';
    default:
      return 'active';
  }
}

function fromApiStatus(status: NonNullable<UpdateSubscriptionDto['status']>): SubscriptionStatus {
  switch (status) {
    case 'paused':
      return SubscriptionStatus.PAUSED;
    case 'cancelled':
      return SubscriptionStatus.CANCELLED;
    default:
      return SubscriptionStatus.ACTIVE;
  }
}
