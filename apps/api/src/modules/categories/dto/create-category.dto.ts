import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Alimentação' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @ApiProperty({ enum: ['income', 'expense'] })
  @IsIn(['income', 'expense'])
  type!: 'income' | 'expense';

  @ApiProperty({ example: 'food' })
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  icon!: string;

  @ApiProperty({ example: 'rgba(255, 218, 214, 0.2)' })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  iconBg!: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  iconBg?: string;
}
