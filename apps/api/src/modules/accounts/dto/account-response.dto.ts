import { ApiProperty } from '@nestjs/swagger';

export class AccountResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: ['checking', 'cash'] })
  kind!: 'checking' | 'cash';

  @ApiProperty()
  balanceCents!: string;

  @ApiProperty()
  icon!: 'bank' | 'cash' | 'wallet';
}

export class AccountActivityPointDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  label!: string;

  @ApiProperty()
  cents!: string;
}
