import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID, Matches } from 'class-validator';

export class CreateBudgetDto {
  @ApiProperty()
  @IsUUID()
  categoryId!: string;

  @ApiProperty({ example: '2026-08-01', description: 'First day of the month' })
  @IsDateString()
  month!: string;

  @ApiProperty({ example: '200000' })
  @Matches(/^\d+$/, { message: 'Informe um valor em centavos' })
  amountCents!: string;
}

export class UpdateBudgetDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^\d+$/, { message: 'Informe um valor em centavos' })
  amountCents?: string;
}

export class ListBudgetsQueryDto {
  @ApiPropertyOptional({ example: '2026-08' })
  @IsOptional()
  month?: string;
}
