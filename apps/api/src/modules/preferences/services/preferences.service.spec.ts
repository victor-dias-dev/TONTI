import { ThemePreference, type User } from '@prisma/client';
import { UsersService } from '../../users/users.service';
import { PreferencesService } from './preferences.service';

const user: User = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'victor@email.com',
  passwordHash: 'hashed',
  name: 'Victor',
  avatarUrl: null,
  currency: 'BRL',
  locale: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  theme: ThemePreference.SYSTEM,
  hideBalances: false,
  periodStartDay: 1,
  notificationsEnabled: true,
  notifyBills: true,
  notifyInvoices: true,
  notifyBudgets: false,
  notifyUnusual: true,
  notifyGoals: false,
  notifyLowBalance: true,
  createdAt: new Date('2026-08-30T10:00:00.000Z'),
  updatedAt: new Date('2026-08-30T10:00:00.000Z'),
  deletedAt: null,
};

describe('PreferencesService', () => {
  let service: PreferencesService;
  let usersService: { findById: jest.Mock; update: jest.Mock };

  beforeEach(() => {
    usersService = {
      findById: jest.fn().mockResolvedValue(user),
      update: jest.fn().mockImplementation(async (_id: string, data: Partial<User>) => ({
        ...user,
        ...data,
      })),
    };
    service = new PreferencesService(usersService as unknown as UsersService);
  });

  it('maps stored enums to the mobile contract', async () => {
    const result = await service.get(user.id);
    expect(result.theme).toBe('system');
    expect(result.currency).toBe('BRL');
    expect(result.periodStartDay).toBe(1);
    expect(result.hideBalances).toBe(false);
  });

  it('persists a theme change', async () => {
    const result = await service.update(user.id, { theme: 'dark', hideBalances: true });
    expect(usersService.update).toHaveBeenCalledWith(
      user.id,
      expect.objectContaining({ theme: ThemePreference.DARK, hideBalances: true }),
    );
    expect(result.theme).toBe('dark');
    expect(result.hideBalances).toBe(true);
  });
});
