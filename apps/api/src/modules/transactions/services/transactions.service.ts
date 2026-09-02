import { randomUUID } from 'node:crypto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountType, type Account } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import {
  addCalendarMonths,
  fromZonedCivil,
  financialMonthRange,
  zonedCivilDate,
} from '../../../common/dates/zoned-time';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { balanceDelta, fromApiTransactionType } from '../../../common/finance/mapping';
import { toTransactionView } from '../../../common/finance/presenters';
import { centsToDecimal } from '../../../common/money/money';
import { AccountsRepository } from '../../accounts/repositories/accounts.repository';
import { CategoriesRepository } from '../../categories/repositories/categories.repository';
import { UsersService } from '../../users/users.service';
import type { CreateTransactionDto, UpdateTransactionDto } from '../dto/create-transaction.dto';
import type { ListTransactionsQueryDto } from '../dto/list-transactions-query.dto';
import type { TransactionResponseDto } from '../dto/transaction-response.dto';
import { TransactionsRepository } from '../repositories/transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly accountsRepository: AccountsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly usersService: UsersService,
  ) {}

  async list(userId: string, query: ListTransactionsQueryDto): Promise<TransactionResponseDto[]> {
    const { from, to } = await this.resolveRange(userId, query);
    const take = query.limit;
    const skip = query.page && query.limit ? (query.page - 1) * query.limit : undefined;
    const rows = await this.transactionsRepository.findMany(userId, {
      from,
      to,
      categoryId: query.categoryId,
      accountId: query.accountId,
      type: query.type ? fromApiTransactionType(query.type) : undefined,
      q: query.q?.trim() || undefined,
      skip,
      take,
    });
    return rows.map((row) => toTransactionView(row, row.account));
  }

  async getById(userId: string, id: string): Promise<TransactionResponseDto> {
    const transaction = await this.requireOwned(userId, id);
    return toTransactionView(transaction, transaction.account);
  }

  async related(userId: string, id: string): Promise<TransactionResponseDto[]> {
    const current = await this.requireOwned(userId, id);
    const rows = await this.transactionsRepository.findRelated(
      userId,
      current.categoryId,
      current.id,
      3,
    );
    return rows.map((row) => toTransactionView(row, row.account));
  }

  async byCategory(userId: string, categoryId: string): Promise<TransactionResponseDto[]> {
    const category = await this.categoriesRepository.findByIdAndUser(categoryId, userId);
    if (!category) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Categoria não encontrada');
    }
    const rows = await this.transactionsRepository.findByCategory(userId, categoryId);
    return rows.map((row) => toTransactionView(row, row.account));
  }

  async create(userId: string, dto: CreateTransactionDto): Promise<TransactionResponseDto> {
    const amount = this.requirePositiveCents(dto.amountCents);
    const account = await this.requireAccount(userId, dto.cardId ?? dto.accountId);
    await this.requireCategory(userId, dto.categoryId);
    const type = fromApiTransactionType(dto.type);
    const date = new Date(dto.occurredAt);
    const installments = dto.installmentCount ?? 1;

    if (installments > 1 && account.type !== AccountType.CREDIT_CARD) {
      throw new AppException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.BUSINESS_RULE,
        'Parcelas só são permitidas em cartão de crédito',
      );
    }

    if (installments === 1) {
      const created = await this.transactionsRepository.createLedgerEntry({
        userId,
        accountId: account.id,
        categoryId: dto.categoryId,
        type,
        amount,
        description: dto.description.trim(),
        date,
        merchant: dto.notes?.trim() || null,
        balanceDelta: balanceDelta(account.type, type, amount),
      });
      return toTransactionView(created, created.account);
    }

    const parts = splitInstallments(amount, installments);
    const groupId = randomUUID();
    const user = await this.usersService.findById(userId);
    const timeZone = user?.timezone ?? 'America/Sao_Paulo';
    const start = zonedCivilDate(date, timeZone);

    const created = await this.transactionsRepository.createLedgerEntries(
      parts.map((part, index) => {
        const when = addCalendarMonths(start, index);
        return {
          userId,
          accountId: account.id,
          categoryId: dto.categoryId,
          type,
          amount: part,
          description: `${dto.description.trim()} (${index + 1}/${installments})`,
          date: fromZonedCivil(when.year, when.month, Math.min(start.day, 28), timeZone, 12),
          merchant: dto.notes?.trim() || null,
          installmentGroupId: groupId,
          balanceDelta: balanceDelta(account.type, type, part),
        };
      }),
    );

    const first = created[0];
    if (!first) {
      throw new AppException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.INTERNAL_ERROR,
        'Falha ao criar parcelas',
      );
    }
    return toTransactionView(first, first.account);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const current = await this.requireOwned(userId, id);
    const account = await this.requireAccount(
      userId,
      dto.cardId ?? dto.accountId ?? current.accountId,
    );
    if (dto.categoryId) {
      await this.requireCategory(userId, dto.categoryId);
    }

    const type = dto.type ? fromApiTransactionType(dto.type) : current.type;
    const amount = dto.amountCents ? this.requirePositiveCents(dto.amountCents) : current.amount;
    const reverseDelta = balanceDelta(current.account.type, current.type, current.amount).neg();
    const applyDelta = balanceDelta(account.type, type, amount);

    const updated = await this.transactionsRepository.replaceLedgerEntry(current, {
      accountId: account.id,
      categoryId: dto.categoryId ?? current.categoryId,
      type,
      amount,
      description: dto.description?.trim() ?? current.description,
      date: dto.occurredAt ? new Date(dto.occurredAt) : current.date,
      merchant: dto.notes !== undefined ? dto.notes.trim() || null : current.merchant,
      reverseDelta,
      applyDelta,
      nextAccountId: account.id,
    });

    return toTransactionView(updated, updated.account);
  }

  async remove(userId: string, id: string): Promise<void> {
    const current = await this.requireOwned(userId, id);
    const reverseDelta = balanceDelta(current.account.type, current.type, current.amount).neg();
    await this.transactionsRepository.deleteLedgerEntry(current, reverseDelta);
  }

  private async resolveRange(
    userId: string,
    query: ListTransactionsQueryDto,
  ): Promise<{ from?: Date; to?: Date }> {
    if (query.from || query.to) {
      return {
        from: query.from ? new Date(query.from) : undefined,
        to: query.to ? new Date(query.to) : undefined,
      };
    }

    if (!query.month) {
      return {};
    }

    const match = query.month.match(/^(\d{4})-(\d{2})$/);
    if (!match) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_ERROR,
        'Mês inválido. Use YYYY-MM',
      );
    }

    const user = await this.usersService.findById(userId);
    const timeZone = user?.timezone ?? 'America/Sao_Paulo';
    const year = Number(match[1]);
    const month = Number(match[2]);
    const { start, end } = financialMonthRange(
      fromZonedCivil(year, month, 15, timeZone),
      timeZone,
      user?.periodStartDay ?? 1,
    );
    return { from: start, to: end };
  }

  private requirePositiveCents(cents: string): Decimal {
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

  private async requireOwned(userId: string, id: string) {
    const transaction = await this.transactionsRepository.findByIdAndUser(id, userId);
    if (!transaction) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Transação não encontrada');
    }
    return transaction;
  }

  private async requireAccount(userId: string, id: string): Promise<Account> {
    const account = await this.accountsRepository.findByIdAndUser(id, userId);
    if (!account || !account.isActive) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Conta não encontrada');
    }
    return account;
  }

  private async requireCategory(userId: string, id: string) {
    const category = await this.categoriesRepository.findByIdAndUser(id, userId);
    if (!category) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Categoria não encontrada');
    }
    return category;
  }
}

function splitInstallments(total: Decimal, count: number): Decimal[] {
  const base = total.div(count).toDecimalPlaces(4, Decimal.ROUND_DOWN);
  const parts = Array.from({ length: count }, () => base);
  const first = parts[0] ?? base;
  parts[0] = first.plus(total.minus(base.mul(count)));
  return parts;
}
