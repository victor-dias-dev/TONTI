import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ConnectBenefitDto,
  InstitutionDto,
  ListInstitutionsQueryDto,
} from '../dto/open-finance.dto';
import { OpenFinanceService } from '../services/open-finance.service';

@ApiTags('open-finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('open-finance')
export class OpenFinanceController {
  constructor(private readonly openFinanceService: OpenFinanceService) {}

  @Get('benefits')
  @ApiOperation({ summary: 'Benefits of connecting accounts via Open Finance' })
  benefits(): ConnectBenefitDto[] {
    return this.openFinanceService.benefits();
  }

  @Get('institutions')
  @ApiOperation({ summary: 'List institutions available for Open Finance connection' })
  institutions(@Query() query: ListInstitutionsQueryDto): InstitutionDto[] {
    return this.openFinanceService.institutions(query.q);
  }
}
