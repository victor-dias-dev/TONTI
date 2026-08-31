import { ApiProperty } from '@nestjs/swagger';

export class BudgetItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty()
  plannedCents!: string;

  @ApiProperty()
  spentCents!: string;

  @ApiProperty()
  remainingCents!: string;

  @ApiProperty({ example: '85%' })
  percentLabel!: string;

  @ApiProperty({ enum: ['ok', 'warning', 'over'] })
  status!: 'ok' | 'warning' | 'over';
}

export class PlanningSummaryDto {
  @ApiProperty()
  incomeCents!: string;

  @ApiProperty()
  plannedCents!: string;

  @ApiProperty()
  remainingCents!: string;

  @ApiProperty({ type: [BudgetItemDto] })
  budgets!: BudgetItemDto[];
}
