import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCreditCardDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @ApiProperty({ example: 'Visa' })
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  brand!: string;

  @ApiProperty({ example: '4412' })
  @Matches(/^\d{4}$/, { message: 'Informe os 4 últimos dígitos' })
  lastDigits!: string;

  @ApiProperty({ example: '500000' })
  @Matches(/^\d+$/, { message: 'Informe um valor em centavos' })
  limitCents!: string;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  closingDay!: number;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay!: number;
}

export class UpdateCreditCardDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  brand?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^\d{4}$/, { message: 'Informe os 4 últimos dígitos' })
  lastDigits?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^\d+$/, { message: 'Informe um valor em centavos' })
  limitCents?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  closingDay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay?: number;
}
