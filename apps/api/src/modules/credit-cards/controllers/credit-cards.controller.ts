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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { CardResponseDto, InvoiceResponseDto } from '../dto/card-response.dto';
import { CreateCreditCardDto, UpdateCreditCardDto } from '../dto/create-credit-card.dto';
import { CreditCardsService } from '../services/credit-cards.service';

@ApiTags('credit-cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Get()
  @ApiOperation({ summary: 'List credit cards with current invoice totals' })
  list(@CurrentUser() user: AuthenticatedUser): Promise<CardResponseDto[]> {
    return this.creditCardsService.list(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a credit card' })
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CardResponseDto> {
    return this.creditCardsService.getById(user.id, id);
  }

  @Get(':id/invoices')
  @ApiOperation({ summary: 'List recent invoices of a credit card' })
  listInvoices(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<InvoiceResponseDto[]> {
    return this.creditCardsService.listInvoices(user.id, id);
  }

  @Get(':id/invoices/:invoiceId')
  @ApiOperation({ summary: 'Get an invoice. Use "current" for the open cycle.' })
  getInvoice(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('invoiceId') invoiceId: string,
  ): Promise<InvoiceResponseDto> {
    return this.creditCardsService.getInvoice(user.id, id, invoiceId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a credit card account' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCreditCardDto,
  ): Promise<CardResponseDto> {
    return this.creditCardsService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a credit card' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCreditCardDto,
  ): Promise<CardResponseDto> {
    return this.creditCardsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete or deactivate a credit card' })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.creditCardsService.remove(user.id, id);
  }
}
