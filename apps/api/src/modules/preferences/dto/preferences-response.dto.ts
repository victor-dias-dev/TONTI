import { ApiProperty } from '@nestjs/swagger';

export class PreferencesResponseDto {
  @ApiProperty({ enum: ['system', 'light', 'dark'] })
  theme!: 'system' | 'light' | 'dark';

  @ApiProperty()
  hideBalances!: boolean;

  @ApiProperty({ example: 'BRL' })
  currency!: string;

  @ApiProperty({ example: 1 })
  periodStartDay!: number;

  @ApiProperty()
  notificationsEnabled!: boolean;

  @ApiProperty()
  notifyBills!: boolean;

  @ApiProperty()
  notifyInvoices!: boolean;

  @ApiProperty()
  notifyBudgets!: boolean;

  @ApiProperty()
  notifyUnusual!: boolean;

  @ApiProperty()
  notifyGoals!: boolean;

  @ApiProperty()
  notifyLowBalance!: boolean;
}
