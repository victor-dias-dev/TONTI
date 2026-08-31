import { HttpStatus, Injectable } from '@nestjs/common';
import { CategoryType, TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { fromZonedCivil, monthRange, zonedCivilDate } from '../../../common/dates/zoned-time';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { formatPercentLabel } from '../../../common/labels/pt-br';
import {
  centsToDecimal,
  decimalToCents,
  sumDecimals,
  zeroDecimal,
} from '../../../common/money/money';
import { CategoriesRepository } from '../../categories/repositories/categories.repository';
import { TransactionsRepository } from '../../transactions/repositories/transactions.repository';
import { UsersService } from '../../users/users.service';
import type { BudgetItemDto, PlanningSummaryDto } from '../dto/budget-response.dto';
import type { CreateBudgetDto, UpdateBudgetDto } from '../dto/create-budget.dto';
import { BudgetsRepository } from '../repositories/budgets.repository';

@Injectable()
export class BudgetsService {
  constructor(
    private readonly budgetsRepository: BudgetsRepository,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly usersService: UsersService,
  ) {}

  async summary(userId: string, monthParam?: string): Promise<PlanningSummaryDto> {
    const { monthStart, range } = await this.resolveMonth(userId, monthParam);
    const [budgets, totals, spentByCategory] = await Promise.all([
      this.budgetsRepository.findByUserAndMonth(userId, monthStart),
      this.transactionsRepository.sumByType(userId, range.start, range.end),
      this.transactionsRepository.sumExpensesByCategory(userId, range.start, range.end),
    ]);

    const spentMap = new Map(spentByCategory.map((row) => [row.categoryId, row.amount]));
    const income =
      totals.find((row) => row.type === TransactionType.INCOME)?.amount ?? zeroDecimal();
    const items = budgets.map((budget) =>
      this.toItem(
        budget.id,
        budget.categoryId,
        budget.amount,
        spentMap.get(budget.categoryId) ?? zeroDecimal(),
      ),
    );
    const planned = sumDecimals(items.map((item) => centsToDecimal(item.plannedCents)));
    const spent = sumDecimals(items.map((item) => centsToDecimal(item.spentCents)));

    return {
      incomeCents: decimalToCents(income),
      plannedCents: decimalToCents(planned),
      remainingCents: decimalToCents(planned.minus(spent)),
      budgets: items,
    };
  }

  async getById(userId: string, id: string): Promise<BudgetItemDto> {
    const budget = await this.budgetsRepository.findByIdAndUser(id, userId);
    if (!budget) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Orçamento não encontrado');
    }

    const user = await this.usersService.findById(userId);
    const timeZone = user?.timezone ?? 'America/Sao_Paulo';
    const civil = zonedCivilDate(budget.month, 'UTC');
    const range = monthRange(fromZonedCivil(civil.year, civil.month, 15, timeZone), timeZone);
    const spentRows = await this.transactionsRepository.sumExpensesByCategory(
      userId,
      range.start,
      range.end,
    );
    const spent =
      spentRows.find((row) => row.categoryId === budget.categoryId)?.amount ?? zeroDecimal();
    return this.toItem(budget.id, budget.categoryId, budget.amount, spent);
  }

  async create(userId: string, dto: CreateBudgetDto): Promise<BudgetItemDto> {
    const category = await this.categoriesRepository.findByIdAndUser(dto.categoryId, userId);
    if (!category) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Categoria não encontrada');
    }
    if (category.type !== CategoryType.EXPENSE) {
      throw new AppException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.BUSINESS_RULE,
        'Orçamentos só podem ser criados para categorias de despesa',
      );
    }

    const amount = centsToDecimal(dto.amountCents);
    if (amount.lt(0)) {
      throw new AppException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.BUSINESS_RULE,
        'O valor planejado não pode ser negativo',
      );
    }

    const monthStart = monthDateFromParam(dto.month);
    const existing = await this.budgetsRepository.findByUserCategoryMonth(
      userId,
      dto.categoryId,
      monthStart,
    );
    if (existing) {
      throw new AppException(
        HttpStatus.CONFLICT,
        ErrorCode.CONFLICT,
        'Já existe um orçamento para esta categoria neste mês',
      );
    }

    const budget = await this.budgetsRepository.create({
      userId,
      categoryId: dto.categoryId,
      month: monthStart,
      amount,
    });

    return this.toItem(budget.id, budget.categoryId, budget.amount, zeroDecimal());
  }

  async update(userId: string, id: string, dto: UpdateBudgetDto): Promise<BudgetItemDto> {
    const current = await this.budgetsRepository.findByIdAndUser(id, userId);
    if (!current) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Orçamento não encontrado');
    }

    const amount = dto.amountCents ? centsToDecimal(dto.amountCents) : current.amount;
    if (amount.lt(0)) {
      throw new AppException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.BUSINESS_RULE,
        'O valor planejado não pode ser negativo',
      );
    }

    const budget = await this.budgetsRepository.update(id, { amount });
    return this.getById(userId, budget.id);
  }

  async remove(userId: string, id: string): Promise<void> {
    const budget = await this.budgetsRepository.findByIdAndUser(id, userId);
    if (!budget) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Orçamento não encontrado');
    }
    await this.budgetsRepository.delete(id);
  }

  private toItem(id: string, categoryId: string, planned: Decimal, spent: Decimal): BudgetItemDto {
    const plannedCents = BigInt(decimalToCents(planned));
    const spentCents = BigInt(decimalToCents(spent));
    const remaining = planned.minus(spent);
    const percent = plannedCents === 0n ? 0n : (spentCents * 100n) / plannedCents;
    const status: BudgetItemDto['status'] =
      percent > 100n ? 'over' : percent >= 85n ? 'warning' : 'ok';

    return {
      id,
      categoryId,
      plannedCents: decimalToCents(planned),
      spentCents: decimalToCents(spent),
      remainingCents: decimalToCents(remaining),
      percentLabel: formatPercentLabel(spentCents, plannedCents),
      status,
    };
  }

  private async resolveMonth(userId: string, monthParam?: string) {
    const user = await this.usersService.findById(userId);
    const timeZone = user?.timezone ?? 'America/Sao_Paulo';
    const reference = monthParam
      ? fromZonedCivil(
          Number(monthParam.slice(0, 4)),
          Number(monthParam.slice(5, 7) || 1),
          15,
          timeZone,
        )
      : new Date();
    const civil = zonedCivilDate(reference, timeZone);
    const monthStart = new Date(Date.UTC(civil.year, civil.month - 1, 1));
    return { monthStart, range: monthRange(reference, timeZone) };
  }
}

function monthDateFromParam(input: string): Date {
  const match = input.match(/^(\d{4})-(\d{2})/);
  if (!match) {
    return new Date(Date.UTC(new Date(input).getUTCFullYear(), new Date(input).getUTCMonth(), 1));
  }
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
}
