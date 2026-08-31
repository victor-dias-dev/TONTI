import { ApiProperty } from '@nestjs/swagger';

export class InsightDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  text!: string;
}

export class UpcomingPaymentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  dueLabel!: string;

  @ApiProperty()
  amountCents!: string;

  @ApiProperty()
  icon!: string;
}

export class DashboardResponseDto {
  @ApiProperty()
  balanceCents!: string;

  @ApiProperty()
  incomeCents!: string;

  @ApiProperty()
  expenseCents!: string;

  @ApiProperty()
  availableCents!: string;

  @ApiProperty()
  variationLabel!: string;

  @ApiProperty()
  spentCents!: string;

  @ApiProperty()
  spentLimitCents!: string;

  @ApiProperty()
  monthLabel!: string;

  @ApiProperty({ type: InsightDto })
  insight!: InsightDto;

  @ApiProperty({ type: [UpcomingPaymentDto] })
  upcoming!: UpcomingPaymentDto[];

  @ApiProperty({ type: [String] })
  recentTransactionIds!: string[];
}
