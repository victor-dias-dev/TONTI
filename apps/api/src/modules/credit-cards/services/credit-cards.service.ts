import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountType, TransactionType, type Account } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import {
  currentBillingCycle,
  recentBillingCycles,
  type BillingCycle,
} from '../../../common/dates/billing-cycle';
import { zonedCivilDate } from '../../../common/dates/zoned-time';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { dayMonthLabel } from '../../../common/labels/pt-br';
import { formatCardInstitution, parseCardInstitution } from '../../../common/finance/mapping';
import {
  centsToDecimal,
  decimalToCents,
  sumDecimals,
  zeroDecimal,
} from '../../../common/money/money';
import { AccountsRepository } from '../../accounts/repositories/accounts.repository';
import { TransactionsRepository } from '../../transactions/repositories/transactions.repository';
import { UsersService } from '../../users/users.service';
import type { CardResponseDto, InvoiceResponseDto } from '../dto/card-response.dto';
import type { CreateCreditCardDto, UpdateCreditCardDto } from '../dto/create-credit-card.dto';

@Injectable()
export class CreditCardsService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly usersService: UsersService,
  ) {}

  async list(userId: string): Promise<CardResponseDto[]> {
    const cards = await this.accountsRepository.findCreditCards(userId);
    const now = new Date();
    const timeZone = await this.timeZone(userId);
    const snapshots = await this.snapshots(userId, cards, now, timeZone);
    return cards.map((card, index) => {
      const snapshot = snapshots[index];
      if (!snapshot) {
        throw new AppException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          ErrorCode.INTERNAL_ERROR,
          'Falha ao calcular fatura',
        );
      }
      return this.toCard(card, snapshot, timeZone, now);
    });
  }

  async getById(userId: string, id: string): Promise<CardResponseDto> {
    const card = await this.requireCard(userId, id);
    const now = new Date();
    const timeZone = await this.timeZone(userId);
    const [snapshot] = await this.snapshots(userId, [card], now, timeZone);
    if (!snapshot) {
      throw new AppException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.INTERNAL_ERROR,
        'Falha ao calcular fatura',
      );
    }
    return this.toCard(card, snapshot, timeZone, now);
  }

  async create(userId: string, dto: CreateCreditCardDto): Promise<CardResponseDto> {
    const limit = centsToDecimal(dto.limitCents);
    const account = await this.accountsRepository.create({
      userId,
      name: dto.name.trim(),
      type: AccountType.CREDIT_CARD,
      initialBalance: zeroDecimal(),
      currentBalance: zeroDecimal(),
      institution: formatCardInstitution(dto.brand, dto.lastDigits),
      brand: dto.brand.trim(),
      lastFour: dto.lastDigits,
      creditLimit: limit,
      closingDay: dto.closingDay,
      dueDay: dto.dueDay,
    });
    return this.getById(userId, account.id);
  }

  async update(userId: string, id: string, dto: UpdateCreditCardDto): Promise<CardResponseDto> {
    const card = await this.requireCard(userId, id);
    const current = parseCardInstitution(card.institution);
    await this.accountsRepository.update(id, {
      name: dto.name?.trim(),
      institution:
        dto.brand || dto.lastDigits
          ? formatCardInstitution(dto.brand ?? current.brand, dto.lastDigits ?? current.lastDigits)
          : undefined,
      brand: dto.brand?.trim(),
      lastFour: dto.lastDigits,
      creditLimit: dto.limitCents ? centsToDecimal(dto.limitCents) : undefined,
      closingDay: dto.closingDay,
      dueDay: dto.dueDay,
    });
    return this.getById(userId, id);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.requireCard(userId, id);
    const count = await this.accountsRepository.countTransactions(id);
    if (count > 0) {
      await this.accountsRepository.update(id, { isActive: false });
      return;
    }
    await this.accountsRepository.delete(id);
  }

  async listInvoices(userId: string, cardId: string): Promise<InvoiceResponseDto[]> {
    const card = await this.requireCard(userId, cardId);
    const now = new Date();
    const timeZone = await this.timeZone(userId);
    const closingDay = card.closingDay ?? 1;
    const dueDay = card.dueDay ?? 10;
    const cycles = recentBillingCycles(now, closingDay, dueDay, timeZone, 3);
    const from = cycles[cycles.length - 1]?.start ?? now;
    const rows = await this.transactionsRepository.findConfirmedForAccounts(
      userId,
      [card.id],
      from,
    );

    return cycles.map((cycle) => this.toInvoice(card, cycle, rows, timeZone, now));
  }

  async getInvoice(userId: string, cardId: string, invoiceId: string): Promise<InvoiceResponseDto> {
    const invoices = await this.listInvoices(userId, cardId);
    const invoice =
      invoiceId === 'current'
        ? invoices[0]
        : invoices.find((item) => item.id === invoiceId || item.id.endsWith(invoiceId));

    if (!invoice) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Fatura não encontrada');
    }

    return invoice;
  }

  private async snapshots(
    userId: string,
    cards: Account[],
    now: Date,
    timeZone: string,
  ): Promise<Array<{ cycle: BillingCycle; used: Decimal; transactionIds: string[] }>> {
    if (cards.length === 0) {
      return [];
    }

    const cycles = cards.map((card) =>
      currentBillingCycle(now, card.closingDay ?? 1, card.dueDay ?? 10, timeZone),
    );
    const from = cycles.reduce(
      (min, cycle) => (cycle.start < min ? cycle.start : min),
      cycles[0]!.start,
    );
    const rows = await this.transactionsRepository.findConfirmedForAccounts(
      userId,
      cards.map((card) => card.id),
      from,
    );

    return cards.map((card, index) => {
      const cycle = cycles[index]!;
      const inCycle = rows.filter(
        (row) =>
          row.accountId === card.id &&
          row.date >= cycle.start &&
          row.date < cycle.end &&
          row.type === TransactionType.EXPENSE,
      );
      return {
        cycle,
        used: sumDecimals(inCycle.map((row) => row.amount)),
        transactionIds: inCycle.map((row) => row.id),
      };
    });
  }

  private toCard(
    card: Account,
    snapshot: { cycle: BillingCycle; used: Decimal; transactionIds: string[] },
    timeZone: string,
    now: Date,
  ): CardResponseDto {
    const today = zonedCivilDate(now, timeZone);
    const closing = zonedCivilDate(snapshot.cycle.closingDate, timeZone);
    const open =
      today.year < closing.year ||
      (today.year === closing.year && today.month < closing.month) ||
      (today.year === closing.year && today.month === closing.month && today.day <= closing.day);

    const details = card.brand
      ? {
          brand: card.brand,
          lastDigits: card.lastFour ?? parseCardInstitution(card.institution).lastDigits,
        }
      : parseCardInstitution(card.institution);

    return {
      id: card.id,
      name: card.name,
      brand: details.brand,
      lastDigits: details.lastDigits,
      invoiceCents: decimalToCents(snapshot.used),
      limitCents: decimalToCents(card.creditLimit ?? zeroDecimal()),
      usedCents: decimalToCents(snapshot.used),
      dueLabel: dayMonthLabel(snapshot.cycle.dueDate, timeZone),
      bestPurchaseDayLabel: dayMonthLabel(snapshot.cycle.bestPurchaseDate, timeZone),
      status: open ? 'open' : 'closed',
      accountId: card.id,
    };
  }

  private toInvoice(
    card: Account,
    cycle: BillingCycle,
    rows: Array<{
      id: string;
      accountId: string;
      amount: Decimal;
      type: TransactionType;
      date: Date;
    }>,
    timeZone: string,
    now: Date,
  ): InvoiceResponseDto {
    const inCycle = rows.filter(
      (row) =>
        row.accountId === card.id &&
        row.date >= cycle.start &&
        row.date < cycle.end &&
        row.type === TransactionType.EXPENSE,
    );
    const today = zonedCivilDate(now, timeZone);
    const closing = zonedCivilDate(cycle.closingDate, timeZone);
    const open =
      today.year < closing.year ||
      (today.year === closing.year && today.month < closing.month) ||
      (today.year === closing.year && today.month === closing.month && today.day <= closing.day);

    return {
      id: `${card.id}:${cycle.id}`,
      cardId: card.id,
      totalCents: decimalToCents(sumDecimals(inCycle.map((row) => row.amount))),
      dueLabel: dayMonthLabel(cycle.dueDate, timeZone),
      bestPurchaseDayLabel: dayMonthLabel(cycle.bestPurchaseDate, timeZone),
      status: open ? 'open' : 'closed',
      transactionIds: inCycle.map((row) => row.id),
    };
  }

  private async requireCard(userId: string, id: string): Promise<Account> {
    const account = await this.accountsRepository.findByIdAndUser(id, userId);
    if (!account || !account.isActive || account.type !== AccountType.CREDIT_CARD) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Cartão não encontrado');
    }
    return account;
  }

  private async timeZone(userId: string): Promise<string> {
    const user = await this.usersService.findById(userId);
    return user?.timezone ?? 'America/Sao_Paulo';
  }
}
