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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { toTransactionView } from '../../../common/finance/presenters';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { AccountActivityPointDto, AccountResponseDto } from '../dto/account-response.dto';
import { CreateAccountDto, UpdateAccountDto } from '../dto/create-account.dto';
import { AccountsService } from '../services/accounts.service';

@ApiTags('accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'List bank and cash accounts' })
  list(@CurrentUser() user: AuthenticatedUser): Promise<AccountResponseDto[]> {
    return this.accountsService.list(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account' })
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AccountResponseDto> {
    return this.accountsService.getById(user.id, id);
  }

  @Get(':id/transactions')
  @ApiOperation({ summary: 'List transactions of an account' })
  async listTransactions(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const transactions = await this.accountsService.listTransactions(user.id, id);
    return transactions.map((transaction) => toTransactionView(transaction));
  }

  @Get(':id/activity')
  @ApiOperation({ summary: 'Monthly activity of an account' })
  activity(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AccountActivityPointDto[]> {
    return this.accountsService.activity(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an account' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAccountDto,
  ): Promise<AccountResponseDto> {
    return this.accountsService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccountDto,
  ): Promise<AccountResponseDto> {
    return this.accountsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete or deactivate an account' })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.accountsService.remove(user.id, id);
  }
}
