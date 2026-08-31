import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { monthRange, previousMonthRange, zonedCivilDate } from '../../../common/dates/zoned-time';
import { dueRelativeLabel, formatVariationLabel, monthLabel } from '../../../common/labels/pt-br';
import { decimalToCents, zeroDecimal } from '../../../common/money/money';
import { UsersService } from '../../users/users.service';
import type { DashboardResponseDto } from '../dto/dashboard-response.dto';
import { DashboardRepository } from '../repositories/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly dashboardRepository: DashboardRepository,
    private readonly usersService: UsersService,
  ) {}

  async get(userId: string): Promise<DashboardResponseDto> {
    const user = await this.usersService.findById(userId);
    const timeZone = user?.timezone ?? 'America/Sao_Paulo';
    const now = new Date();
    const current = monthRange(now, timeZone);
    const previous = previousMonthRange(now, timeZone);
    const upcomingUntil = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const today = zonedCivilDate(now, timeZone);
    const upcomingFrom = new Date(Date.UTC(today.year, today.month - 1, today.day));

    const snapshot = await this.dashboardRepository.getSnapshot(
      userId,
      current.start,
      current.end,
      previous.start,
      upcomingFrom,
      upcomingUntil,
    );

    const income =
      snapshot.monthTotals.find((row) => row.type === TransactionType.INCOME)?.amount ??
      zeroDecimal();
    const expense =
      snapshot.monthTotals.find((row) => row.type === TransactionType.EXPENSE)?.amount ??
      zeroDecimal();
    const previousExpense =
      snapshot.previousTotals.find((row) => row.type === TransactionType.EXPENSE)?.amount ??
      zeroDecimal();

    const balanceCents = decimalToCents(snapshot.balance);
    const expenseCents = decimalToCents(expense);

    return {
      balanceCents,
      incomeCents: decimalToCents(income),
      expenseCents,
      availableCents: balanceCents,
      variationLabel: formatVariationLabel(
        BigInt(expenseCents),
        BigInt(decimalToCents(previousExpense)),
      ),
      spentCents: expenseCents,
      spentLimitCents: decimalToCents(snapshot.budgetTotal),
      monthLabel: monthLabel(now, timeZone),
      insight: this.insight(snapshot.foodSpent, snapshot.previousFoodSpent),
      upcoming: snapshot.upcoming.map((item) => ({
        id: item.id,
        title: item.name,
        dueLabel: dueRelativeLabel(item.nextChargeDate, now, timeZone),
        amountCents: decimalToCents(item.amount),
        icon: item.icon,
      })),
      recentTransactionIds: snapshot.recentIds,
    };
  }

  private insight(
    foodSpent: ReturnType<typeof zeroDecimal>,
    previousFoodSpent: ReturnType<typeof zeroDecimal>,
  ): { id: string; text: string } {
    const current = BigInt(decimalToCents(foodSpent));
    const previous = BigInt(decimalToCents(previousFoodSpent));

    if (previous > 0n && current < previous) {
      const percent = ((previous - current) * 100n) / previous;
      return {
        id: 'insight-food',
        text: `Você gastou ${percent}% menos com alimentação este mês. Continue assim!`,
      };
    }

    if (previous > 0n && current > previous) {
      const percent = ((current - previous) * 100n) / previous;
      return {
        id: 'insight-food',
        text: `Você gastou ${percent}% mais com alimentação este mês.`,
      };
    }

    return {
      id: 'insight-default',
      text: 'Acompanhe seus gastos para receber insights personalizados.',
    };
  }
}
