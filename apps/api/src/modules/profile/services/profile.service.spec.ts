import { HttpStatus } from '@nestjs/common';
import type { User } from '@prisma/client';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { PasswordService } from '../../../common/security/password.service';
import { UsersService } from '../../users/users.service';
import { ProfileService } from './profile.service';

const user: User = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'victor@email.com',
  passwordHash: 'hashed',
  name: 'Victor',
  avatarUrl: null,
  currency: 'BRL',
  locale: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  theme: 'SYSTEM',
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

describe('ProfileService', () => {
  let service: ProfileService;
  let usersService: {
    findById: jest.Mock;
    findByEmailIncludingDeleted: jest.Mock;
    update: jest.Mock;
  };
  let passwordService: { hash: jest.Mock; verify: jest.Mock };

  beforeEach(() => {
    usersService = {
      findById: jest.fn().mockResolvedValue(user),
      findByEmailIncludingDeleted: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockImplementation(async (_id: string, data: Partial<User>) => ({
        ...user,
        ...data,
      })),
    };
    passwordService = {
      hash: jest.fn().mockResolvedValue('new-hash'),
      verify: jest.fn().mockResolvedValue(true),
    };
    service = new ProfileService(
      usersService as unknown as UsersService,
      passwordService as unknown as PasswordService,
    );
  });

  it('returns the authenticated profile', async () => {
    const result = await service.get(user.id);
    expect(result).toEqual({ id: user.id, name: user.name, email: user.email });
  });

  it('updates the display name', async () => {
    const result = await service.update(user.id, { name: 'Ana Silva' });
    expect(usersService.update).toHaveBeenCalledWith(user.id, { name: 'Ana Silva' });
    expect(result.name).toBe('Ana Silva');
  });

  it('updates the email', async () => {
    usersService.findByEmailIncludingDeleted.mockResolvedValue(null);
    const result = await service.update(user.id, { email: 'Ana.Silva@email.com' });
    expect(usersService.update).toHaveBeenCalledWith(user.id, { email: 'ana.silva@email.com' });
    expect(result.email).toBe('ana.silva@email.com');
  });

  it('rejects an email already in use', async () => {
    usersService.findByEmailIncludingDeleted.mockResolvedValue({
      ...user,
      id: '22222222-2222-2222-2222-222222222222',
    });
    try {
      await service.update(user.id, { email: 'taken@email.com' });
      fail('expected update to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);
      expect((error as AppException).code).toBe(ErrorCode.EMAIL_ALREADY_EXISTS);
      expect((error as AppException).getStatus()).toBe(HttpStatus.CONFLICT);
    }
  });

  it('rejects an incorrect current password', async () => {
    passwordService.verify.mockResolvedValue(false);
    try {
      await service.changePassword(user.id, {
        currentPassword: 'wrongpass',
        newPassword: 'newpassword',
      });
      fail('expected changePassword to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);
      expect((error as AppException).code).toBe(ErrorCode.INVALID_CREDENTIALS);
      expect((error as AppException).getStatus()).toBe(HttpStatus.UNAUTHORIZED);
    }
  });

  it('hashes the new password', async () => {
    await service.changePassword(user.id, {
      currentPassword: 'password1',
      newPassword: 'password2',
    });
    expect(passwordService.hash).toHaveBeenCalledWith('password2');
    expect(usersService.update).toHaveBeenCalledWith(user.id, { passwordHash: 'new-hash' });
  });
});
