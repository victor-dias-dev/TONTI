import { ApiProperty } from '@nestjs/swagger';

export class InstallmentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  index!: number;

  @ApiProperty({ example: 'Outubro' })
  monthLabel!: string;

  @ApiProperty({ enum: ['paid', 'next', 'upcoming'] })
  status!: 'paid' | 'next' | 'upcoming';

  @ApiProperty({ example: '20000' })
  amountCents!: string;

  @ApiProperty({ example: 'Paga em 12/10' })
  caption!: string;

  @ApiProperty({ example: '1/12' })
  trailingCaption!: string;
}

export class InstallmentPlanDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  merchant!: string;

  @ApiProperty({ example: '12 de Out, 14:30' })
  occurredAtLabel!: string;

  @ApiProperty()
  icon!: string;

  @ApiProperty({ example: '240000' })
  totalCents!: string;

  @ApiProperty({ example: '20000' })
  installmentCents!: string;

  @ApiProperty()
  installmentCount!: number;

  @ApiProperty()
  paidCount!: number;

  @ApiProperty()
  remainingCount!: number;

  @ApiProperty({ example: '180000' })
  remainingCents!: string;

  @ApiProperty({ type: [InstallmentDto] })
  installments!: InstallmentDto[];
}
