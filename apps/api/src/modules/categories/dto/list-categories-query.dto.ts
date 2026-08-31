import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class ListCategoriesQueryDto {
  @ApiPropertyOptional({ enum: ['income', 'expense'] })
  @IsOptional()
  @IsIn(['income', 'expense'])
  type?: 'income' | 'expense';
}
