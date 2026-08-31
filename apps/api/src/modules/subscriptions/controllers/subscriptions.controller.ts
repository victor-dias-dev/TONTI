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
import { CreateSubscriptionDto, UpdateSubscriptionDto } from '../dto/create-subscription.dto';
import { SubscriptionItemDto, SubscriptionsSummaryDto } from '../dto/subscription-response.dto';
import { SubscriptionsService } from '../services/subscriptions.service';

@ApiTags('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'Active subscriptions with monthly and yearly totals' })
  list(@CurrentUser() user: AuthenticatedUser): Promise<SubscriptionsSummaryDto> {
    return this.subscriptionsService.summary(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subscription' })
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SubscriptionItemDto> {
    return this.subscriptionsService.getById(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a recurring subscription' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSubscriptionDto,
  ): Promise<SubscriptionItemDto> {
    return this.subscriptionsService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSubscriptionDto,
  ): Promise<SubscriptionItemDto> {
    return this.subscriptionsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a subscription' })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.subscriptionsService.remove(user.id, id);
  }
}
