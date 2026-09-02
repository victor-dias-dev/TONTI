import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountType, TransactionType, type Account, type Transaction } from '@prisma/client';
import {
  addCalendarMonths,
  fromZonedCivil,
  zonedCivilDate,
} from '../../../common/dates/zoned-time';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { accountIcon, fromApiAccountKind, toApiAccountKind } from '../../../common/finance/mapping';
import { shortMonthLabel } from '../../../common/labels/pt-br';
import {
  centsToDecimal,
  decimalToCents,
  sumDecimals,
  zeroDecimal,
} from '../../../common/money/money';
import { UsersService } from '../../users/users.service';
import type { CreateAccountDto, UpdateAccountDto } from '../dto/create-account.dto';
import { AccountActivityPointDto, AccountResponseDto } from '../dto/account-response.dto';
import { AccountsRepository } from '../repositories/accounts.repository';

@Injectable()
export class AccountsService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly usersService: UsersService,
  ) {}

  async list(userId: string): Promise<AccountResponseDto[]> {
    let accounts = await this.accountsRepository.findBankAccounts(userId);
    if (accounts.length === 0) {
      const wallet = await this.accountsRepository.create({
        userId,
        name: 'Carteira',
        type: AccountType.CASH,
        initialBalance: zeroDecimal(),
        currentBalance: zeroDecimal(),
      });
      accounts = [wallet];
    }
    return accounts.map((account) => this.toResponse(account));
  }

  async getById(userId: string, id: string): Promise<AccountResponseDto> {
    const account = await this.requireBankAccount(userId, id);
    return this.toResponse(account);
  }

  async create(userId: string, dto: CreateAccountDto): Promise<AccountResponseDto> {
    const initial = centsToDecimal(dto.initialBalanceCents ?? '0');
    const account = await this.accountsRepository.create({
      userId,
      name: dto.name.trim(),
      type: fromApiAccountKind(dto.kind),
      initialBalance: initial,
      currentBalance: initial,
    });
    return this.toResponse(account);
  }

  async update(userId: string, id: string, dto: UpdateAccountDto): Promise<AccountResponseDto> {
    await this.requireBankAccount(userId, id);
    const account = await this.accountsRepository.update(id, {
      name: dto.name?.trim(),
      type: dto.kind ? fromApiAccountKind(dto.kind) : undefined,
    });
    return this.toResponse(account);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.requireBankAccount(userId, id);
    const count = await this.accountsRepository.countTransactions(id);
    if (count > 0) {
      await this.accountsRepository.update(id, { isActive: false });
      return;
    }
    await this.accountsRepository.delete(id);
  }

  async listTransactions(userId: string, id: string): Promise<Transaction[]> {
    await this.requireBankAccount(userId, id);
    return this.accountsRepository.findTransactions(id, userId);
  }

  async activity(userId: string, id: string): Promise<AccountActivityPointDto[]> {
    await this.requireBankAccount(userId, id);
    const user = await this.usersService.findById(userId);
    const timeZone = user?.timezone ?? 'America/Sao_Paulo';
    const now = new Date();
    const { year, month } = zonedCivilDate(now, timeZone);
    const startMonth = addCalendarMonths({ year, month, day: 1 }, -5);
    const from = fromZonedCivil(startMonth.year, startMonth.month, 1, timeZone);
    const rows = await this.accountsRepository.findActivityTransactions(id, userId, from);

    const buckets = new Map<string, { label: string; total: ReturnType<typeof zeroDecimal> }>();
    for (let offset = 0; offset < 6; offset += 1) {
      const cursor = addCalendarMonths(startMonth, offset);
      const key = `${cursor.year}-${cursor.month}`;
      const date = fromZonedCivil(cursor.year, cursor.month, 1, timeZone);
      buckets.set(key, { label: shortMonthLabel(date, timeZone), total: zeroDecimal() });
    }

    for (const row of rows) {
      const civil = zonedCivilDate(row.date, timeZone);
      const bucket = buckets.get(`${civil.year}-${civil.month}`);
      if (!bucket) continue;
      if (row.type === TransactionType.INCOME) {
        bucket.total = sumDecimals([bucket.total, row.amount]);
      } else {
        bucket.total = sumDecimals([bucket.total, row.amount]);
      }
    }

    return Array.from(buckets.entries()).map(([key, bucket]) => ({
      id: `${id}-${key}`,
      label: bucket.label,
      cents: decimalToCents(bucket.total),
    }));
  }

  toResponse(account: Account): AccountResponseDto {
    return {
      id: account.id,
      name: account.name,
      kind: toApiAccountKind(account.type),
      balanceCents: decimalToCents(account.currentBalance),
      icon: accountIcon(account.type),
    };
  }

  async requireOwned(userId: string, id: string): Promise<Account> {
    const account = await this.accountsRepository.findByIdAndUser(id, userId);
    if (!account || !account.isActive) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Conta não encontrada');
    }
    return account;
  }

  private async requireBankAccount(userId: string, id: string): Promise<Account> {
    const account = await this.requireOwned(userId, id);
    if (account.type === AccountType.CREDIT_CARD) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Conta não encontrada');
    }
    return account;
  }
}
