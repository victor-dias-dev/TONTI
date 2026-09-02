import { HttpStatus, Injectable } from '@nestjs/common';
import { ThemePreference, type User } from '@prisma/client';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { UsersService } from '../../users/users.service';
import { PreferencesResponseDto } from '../dto/preferences-response.dto';
import type { UpdatePreferencesDto } from '../dto/update-preferences.dto';

const themeToPrisma: Record<'system' | 'light' | 'dark', ThemePreference> = {
  system: ThemePreference.SYSTEM,
  light: ThemePreference.LIGHT,
  dark: ThemePreference.DARK,
};

const themeFromPrisma: Record<ThemePreference, 'system' | 'light' | 'dark'> = {
  SYSTEM: 'system',
  LIGHT: 'light',
  DARK: 'dark',
};

@Injectable()
export class PreferencesService {
  constructor(private readonly usersService: UsersService) {}

  async get(userId: string): Promise<PreferencesResponseDto> {
    return this.toResponse(await this.requireUser(userId));
  }

  async update(userId: string, dto: UpdatePreferencesDto): Promise<PreferencesResponseDto> {
    await this.requireUser(userId);
    const updated = await this.usersService.update(userId, {
      theme: dto.theme ? themeToPrisma[dto.theme] : undefined,
      hideBalances: dto.hideBalances,
      currency: dto.currency,
      periodStartDay: dto.periodStartDay,
      notificationsEnabled: dto.notificationsEnabled,
      notifyBills: dto.notifyBills,
      notifyInvoices: dto.notifyInvoices,
      notifyBudgets: dto.notifyBudgets,
      notifyUnusual: dto.notifyUnusual,
      notifyGoals: dto.notifyGoals,
      notifyLowBalance: dto.notifyLowBalance,
    });
    return this.toResponse(updated);
  }

  private async requireUser(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
        'Preferências não encontradas',
      );
    }
    return user;
  }

  private toResponse(user: User): PreferencesResponseDto {
    return {
      theme: themeFromPrisma[user.theme],
      hideBalances: user.hideBalances,
      currency: user.currency,
      periodStartDay: user.periodStartDay,
      notificationsEnabled: user.notificationsEnabled,
      notifyBills: user.notifyBills,
      notifyInvoices: user.notifyInvoices,
      notifyBudgets: user.notifyBudgets,
      notifyUnusual: user.notifyUnusual,
      notifyGoals: user.notifyGoals,
      notifyLowBalance: user.notifyLowBalance,
    };
  }
}
