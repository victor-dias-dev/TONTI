import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ example: '5990' })
  amountCents!: string;

  @ApiProperty({ example: 15 })
  nextDay!: number;

  @ApiProperty()
  icon!: string;

  @ApiProperty({ enum: ['danger', 'soft', 'muted'] })
  tone!: 'danger' | 'soft' | 'muted';

  @ApiProperty({ enum: ['weekly', 'monthly', 'quarterly', 'yearly'] })
  frequency!: 'weekly' | 'monthly' | 'quarterly' | 'yearly';

  @ApiProperty({ enum: ['active', 'paused', 'cancelled'] })
  status!: 'active' | 'paused' | 'cancelled';
}

export class SubscriptionsSummaryDto {
  @ApiProperty({ example: '122040' })
  insightYearlyCents!: string;

  @ApiProperty({ example: '10170' })
  monthlyCents!: string;

  @ApiProperty({ example: '122040' })
  yearlyCents!: string;

  @ApiProperty({ type: [SubscriptionItemDto] })
  items!: SubscriptionItemDto[];
}
