import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { BudgetItemDto, PlanningSummaryDto } from '../dto/budget-response.dto';
import { CreateBudgetDto, ListBudgetsQueryDto, UpdateBudgetDto } from '../dto/create-budget.dto';
import { BudgetsService } from '../services/budgets.service';

@ApiTags('budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  @ApiOperation({ summary: 'Planning summary for a month, including spent amounts' })
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListBudgetsQueryDto,
  ): Promise<PlanningSummaryDto> {
    return this.budgetsService.summary(user.id, query.month);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a budget with spent and remaining amounts' })
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BudgetItemDto> {
    return this.budgetsService.getById(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a monthly category budget' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBudgetDto,
  ): Promise<BudgetItemDto> {
    return this.budgetsService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a budget amount' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBudgetDto,
  ): Promise<BudgetItemDto> {
    return this.budgetsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a budget' })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.budgetsService.remove(user.id, id);
  }
}
