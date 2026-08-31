import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  icon!: string;

  @ApiProperty()
  iconBg!: string;

  @ApiProperty({ enum: ['income', 'expense'] })
  type!: 'income' | 'expense';
}
