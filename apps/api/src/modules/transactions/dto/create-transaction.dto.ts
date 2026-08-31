import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(180)
  description!: string;

  @ApiProperty({ example: '4590' })
  @Matches(/^\d+$/, { message: 'Informe um valor em centavos' })
  amountCents!: string;

  @ApiProperty({ enum: ['expense', 'income', 'transfer'] })
  @IsIn(['expense', 'income', 'transfer'])
  type!: 'expense' | 'income' | 'transfer';

  @ApiProperty()
  @IsUUID()
  categoryId!: string;

  @ApiProperty()
  @IsUUID()
  accountId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  cardId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({ example: '2026-08-30T12:00:00-03:00' })
  @IsDateString()
  occurredAt!: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 24 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(24)
  installmentCount?: number;
}

export class UpdateTransactionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(180)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^\d+$/, { message: 'Informe um valor em centavos' })
  amountCents?: string;

  @ApiPropertyOptional({ enum: ['expense', 'income', 'transfer'] })
  @IsOptional()
  @IsIn(['expense', 'income', 'transfer'])
  type?: 'expense' | 'income' | 'transfer';

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  cardId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  occurredAt?: string;
}
