import { HttpStatus, Injectable } from '@nestjs/common';
import { zonedCivilDate, type CivilDate } from '../../../common/dates/zoned-time';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { fullMonthName, occurredAtLabel } from '../../../common/labels/pt-br';
import { decimalToCents, sumDecimals } from '../../../common/money/money';
import { UsersService } from '../../users/users.service';
import type { InstallmentDto, InstallmentPlanDto } from '../dto/installment-plan.dto';
import {
  InstallmentsRepository,
  type InstallmentTransaction,
} from '../repositories/installments.repository';

@Injectable()
export class InstallmentsService {
  constructor(
    private readonly installmentsRepository: InstallmentsRepository,
    private readonly usersService: UsersService,
  ) {}

  async list(userId: string): Promise<InstallmentPlanDto[]> {
    const rows = await this.installmentsRepository.findGrouped(userId);
    const timeZone = await this.timeZone(userId);
    const now = new Date();
    const groups = groupByInstallment(rows);
    return Array.from(groups.entries())
      .sort((left, right) => {
        const leftTime = left[1][0]?.date.getTime() ?? 0;
        const rightTime = right[1][0]?.date.getTime() ?? 0;
        return rightTime - leftTime;
      })
      .map(([id, items]) => this.toPlan(id, items, now, timeZone));
  }

  async getById(userId: string, id: string): Promise<InstallmentPlanDto> {
    const rows = await this.installmentsRepository.findGroup(userId, id);
    if (rows.length === 0) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
        'Compra parcelada não encontrada',
      );
    }
    const timeZone = await this.timeZone(userId);
    return this.toPlan(id, rows, new Date(), timeZone);
  }

  private toPlan(
    id: string,
    rows: InstallmentTransaction[],
    now: Date,
    timeZone: string,
  ): InstallmentPlanDto {
    const first = rows[0];
    if (!first) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
        'Compra parcelada não encontrada',
      );
    }

    const today = zonedCivilDate(now, timeZone);
    const count = rows.length;
    const statuses = rows.map((row) =>
      isBeforeCivil(zonedCivilDate(row.date, timeZone), today) ? 'paid' : 'upcoming',
    );
    const firstUnpaid = statuses.findIndex((status) => status !== 'paid');
    const installments: InstallmentDto[] = rows.map((row, offset) => {
      const index = offset + 1;
      const civil = zonedCivilDate(row.date, timeZone);
      const due = `${pad(civil.day)}/${pad(civil.month)}`;
      const paid = firstUnpaid === -1 || offset < firstUnpaid;
      const next = offset === firstUnpaid;
      const status: InstallmentDto['status'] = paid ? 'paid' : next ? 'next' : 'upcoming';

      return {
        id: row.id,
        index,
        monthLabel: fullMonthName(civil.month),
        status,
        amountCents: decimalToCents(row.amount),
        caption: paid ? `Paga em ${due}` : next ? 'Próxima' : 'A vencer',
        trailingCaption: next ? `Vence em ${due}` : `${index}/${count}`,
      };
    });

    const paidCount = installments.filter((item) => item.status === 'paid').length;
    const remainingRows = rows.filter(
      (_, offset) => offset >= (firstUnpaid === -1 ? count : firstUnpaid),
    );
    const remaining = sumDecimals(remainingRows.map((row) => row.amount));

    return {
      id,
      merchant: planTitle(first),
      occurredAtLabel: occurredAtLabel(first.date, timeZone),
      icon: first.category.icon || 'installments',
      totalCents: decimalToCents(sumDecimals(rows.map((row) => row.amount))),
      installmentCents: decimalToCents(first.amount),
      installmentCount: count,
      paidCount,
      remainingCount: count - paidCount,
      remainingCents: decimalToCents(remaining),
      installments,
    };
  }

  private async timeZone(userId: string): Promise<string> {
    const user = await this.usersService.findById(userId);
    return user?.timezone ?? 'America/Sao_Paulo';
  }
}

function groupByInstallment(rows: InstallmentTransaction[]): Map<string, InstallmentTransaction[]> {
  const groups = new Map<string, InstallmentTransaction[]>();
  for (const row of rows) {
    const key = row.installmentGroupId;
    if (!key) continue;
    const list = groups.get(key) ?? [];
    list.push(row);
    groups.set(key, list);
  }
  return groups;
}

function planTitle(row: InstallmentTransaction): string {
  if (row.merchant) {
    return row.merchant;
  }
  return row.description.replace(/\s+\(\d+\/\d+\)$/, '');
}

function isBeforeCivil(left: CivilDate, right: CivilDate): boolean {
  if (left.year !== right.year) return left.year < right.year;
  if (left.month !== right.month) return left.month < right.month;
  return left.day < right.day;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
