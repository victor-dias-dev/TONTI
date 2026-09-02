import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ enum: ['system', 'light', 'dark'] })
  @IsOptional()
  @IsIn(['system', 'light', 'dark'])
  theme?: 'system' | 'light' | 'dark';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hideBalances?: boolean;

  @ApiPropertyOptional({ enum: ['BRL', 'USD', 'EUR'] })
  @IsOptional()
  @IsIn(['BRL', 'USD', 'EUR'])
  currency?: 'BRL' | 'USD' | 'EUR';

  @ApiPropertyOptional({ minimum: 1, maximum: 28 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(28)
  periodStartDay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notifyBills?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notifyInvoices?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notifyBudgets?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notifyUnusual?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notifyGoals?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notifyLowBalance?: boolean;
}
