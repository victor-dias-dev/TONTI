import { ApiProperty } from '@nestjs/swagger';

export class CardResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  brand!: string;

  @ApiProperty()
  lastDigits!: string;

  @ApiProperty()
  invoiceCents!: string;

  @ApiProperty()
  limitCents!: string;

  @ApiProperty()
  usedCents!: string;

  @ApiProperty()
  dueLabel!: string;

  @ApiProperty()
  bestPurchaseDayLabel!: string;

  @ApiProperty({ enum: ['open', 'closed'] })
  status!: 'open' | 'closed';

  @ApiProperty()
  accountId!: string;
}

export class InvoiceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  cardId!: string;

  @ApiProperty()
  totalCents!: string;

  @ApiProperty()
  dueLabel!: string;

  @ApiProperty()
  bestPurchaseDayLabel!: string;

  @ApiProperty({ enum: ['open', 'closed'] })
  status!: 'open' | 'closed';

  @ApiProperty({ type: [String] })
  transactionIds!: string[];
}
