import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ConnectBenefitDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  icon!: string;
}

export class InstitutionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  initial!: string;

  @ApiProperty()
  brandColor!: string;

  @ApiProperty()
  textColor!: string;

  @ApiProperty({ enum: ['circle', 'rounded'] })
  shape!: 'circle' | 'rounded';

  @ApiProperty()
  featured!: boolean;
}

export class ListInstitutionsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;
}
