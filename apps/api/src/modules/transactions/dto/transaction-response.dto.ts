import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ example: '4590' })
  amountCents!: string;

  @ApiProperty({ enum: ['expense', 'income', 'transfer'] })
  type!: 'expense' | 'income' | 'transfer';

  @ApiProperty()
  categoryId!: string;

  @ApiProperty()
  accountId!: string;

  @ApiPropertyOptional()
  cardId?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  occurredAt!: string;
}
