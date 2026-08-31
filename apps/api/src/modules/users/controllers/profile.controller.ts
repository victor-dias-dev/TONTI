import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { UsersService } from '../users.service';

class ProfileResponseDto {
  id!: string;
  name!: string;
  email!: string;
}

class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;
}

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  async get(@CurrentUser() user: AuthenticatedUser): Promise<ProfileResponseDto> {
    const current = await this.usersService.findById(user.id);
    return { id: user.id, name: current?.name ?? user.name, email: current?.email ?? user.email };
  }

  @Patch()
  @ApiOperation({ summary: 'Update the authenticated user profile' })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const updated = dto.name
      ? await this.usersService.update(user.id, { name: dto.name.trim() })
      : await this.usersService.findById(user.id);

    return {
      id: user.id,
      name: updated?.name ?? user.name,
      email: updated?.email ?? user.email,
    };
  }
}
