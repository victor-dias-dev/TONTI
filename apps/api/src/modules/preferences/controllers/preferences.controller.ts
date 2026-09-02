import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { PreferencesResponseDto } from '../dto/preferences-response.dto';
import { UpdatePreferencesDto } from '../dto/update-preferences.dto';
import { PreferencesService } from '../services/preferences.service';

@ApiTags('preferences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get display and notification preferences' })
  get(@CurrentUser() user: AuthenticatedUser): Promise<PreferencesResponseDto> {
    return this.preferencesService.get(user.id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update display and notification preferences' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePreferencesDto,
  ): Promise<PreferencesResponseDto> {
    return this.preferencesService.update(user.id, dto);
  }
}
