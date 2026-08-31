import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { AssistantConversationDto, SendAssistantMessageDto } from '../dto/assistant.dto';
import { AssistantService } from '../services/assistant.service';

@ApiTags('assistant')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get()
  @ApiOperation({ summary: 'Financial assistant conversation with live insights' })
  conversation(@CurrentUser() user: AuthenticatedUser): Promise<AssistantConversationDto> {
    return this.assistantService.conversation(user.id);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Ask the assistant a question about current finances' })
  reply(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SendAssistantMessageDto,
  ): Promise<AssistantConversationDto> {
    return this.assistantService.reply(user.id, dto.text);
  }
}
