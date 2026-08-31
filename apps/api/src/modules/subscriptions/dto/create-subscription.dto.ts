import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const FREQUENCIES = ['weekly', 'monthly', 'quarterly', 'yearly'] as const;
const STATUSES = ['active', 'paused', 'cancelled'] as const;

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'Netflix' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @ApiProperty({ example: '5990' })
  @Matches(/^\d+$/, { message: 'Informe um valor em centavos' })
  amountCents!: string;

  @ApiProperty()
  @IsUUID()
  accountId!: string;

  @ApiProperty()
  @IsUUID()
  categoryId!: string;

  @ApiProperty({ enum: FREQUENCIES, default: 'monthly' })
  @IsIn(FREQUENCIES)
  frequency!: (typeof FREQUENCIES)[number];

  @ApiProperty({ example: '2026-09-15' })
  @IsDateString()
  nextChargeDate!: string;
}

export class UpdateSubscriptionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^\d+$/, { message: 'Informe um valor em centavos' })
  amountCents?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ enum: FREQUENCIES })
  @IsOptional()
  @IsIn(FREQUENCIES)
  frequency?: (typeof FREQUENCIES)[number];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  nextChargeDate?: string;

  @ApiPropertyOptional({ enum: STATUSES })
  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number];
}
