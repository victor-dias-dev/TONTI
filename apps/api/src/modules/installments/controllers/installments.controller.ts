import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { InstallmentPlanDto } from '../dto/installment-plan.dto';
import { InstallmentsService } from '../services/installments.service';

@ApiTags('installments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('installments')
export class InstallmentsController {
  constructor(private readonly installmentsService: InstallmentsService) {}

  @Get()
  @ApiOperation({ summary: 'List installment purchases grouped from ledger entries' })
  list(@CurrentUser() user: AuthenticatedUser): Promise<InstallmentPlanDto[]> {
    return this.installmentsService.list(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one installment purchase by group id' })
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<InstallmentPlanDto> {
    return this.installmentsService.getById(user.id, id);
  }
}
