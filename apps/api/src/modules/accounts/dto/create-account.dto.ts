import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ example: 'Nubank' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @ApiProperty({ enum: ['checking', 'cash'] })
  @IsIn(['checking', 'cash'])
  kind!: 'checking' | 'cash';

  @ApiPropertyOptional({ example: '0' })
  @IsOptional()
  @Matches(/^\d+$/, { message: 'Informe um valor em centavos' })
  initialBalanceCents?: string;
}

export class UpdateAccountDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['checking', 'cash'])
  kind?: 'checking' | 'cash';
}
