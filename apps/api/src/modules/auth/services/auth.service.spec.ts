import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { PasswordService } from '../../../common/security/password.service';
import { UsersService } from '../../users/users.service';
import { AuthService } from './auth.service';

const user: User = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'victor@email.com',
  passwordHash: 'hashed',
  name: 'Victor',
  avatarUrl: null,
  currency: 'BRL',
  locale: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  createdAt: new Date('2026-08-30T10:00:00.000Z'),
  updatedAt: new Date('2026-08-30T10:00:00.000Z'),
  deletedAt: null,
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    findByEmailIncludingDeleted: jest.Mock;
    findByEmail: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
    toPublicUser: jest.Mock;
  };
  let passwordService: { hash: jest.Mock; verify: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(() => {
    usersService = {
      findByEmailIncludingDeleted: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      toPublicUser: jest.fn().mockReturnValue({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }),
    };

    passwordService = {
      hash: jest.fn().mockResolvedValue('hashed'),
      verify: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('token'),
    };

    const configService = {
      getOrThrow: jest.fn().mockReturnValue('7d'),
    };

    service = new AuthService(
      usersService as unknown as UsersService,
      passwordService as unknown as PasswordService,
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
    );
  });

  it('registers a user without exposing the password hash', async () => {
    usersService.findByEmailIncludingDeleted.mockResolvedValue(null);
    usersService.create.mockResolvedValue(user);

    const result = await service.register({
      name: 'Victor',
      email: 'Victor@email.com',
      password: 'password',
    });

    expect(usersService.create).toHaveBeenCalledWith({
      email: 'victor@email.com',
      name: 'Victor',
      passwordHash: 'hashed',
    });
    expect(result).not.toHaveProperty('passwordHash');
    expect(result.email).toBe('victor@email.com');
  });

  it('rejects duplicate emails', async () => {
    usersService.findByEmailIncludingDeleted.mockResolvedValue(user);

    try {
      await service.register({
        name: 'Victor',
        email: 'victor@email.com',
        password: 'password',
      });
      fail('expected register to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);
      expect((error as AppException).code).toBe(ErrorCode.EMAIL_ALREADY_EXISTS);
      expect((error as AppException).getStatus()).toBe(HttpStatus.CONFLICT);
    }
  });

  it('returns a JWT on valid login', async () => {
    usersService.findByEmail.mockResolvedValue(user);
    passwordService.verify.mockResolvedValue(true);

    const result = await service.login({
      email: 'victor@email.com',
      password: 'password',
    });

    expect(result.accessToken).toBe('token');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects invalid credentials', async () => {
    usersService.findByEmail.mockResolvedValue(user);
    passwordService.verify.mockResolvedValue(false);

    try {
      await service.login({ email: 'victor@email.com', password: 'wrongpass' });
      fail('expected login to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);
      expect((error as AppException).code).toBe(ErrorCode.INVALID_CREDENTIALS);
    }
  });
});
