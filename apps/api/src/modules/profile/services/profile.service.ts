import { HttpStatus, Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { PasswordService } from '../../../common/security/password.service';
import { normalizeEmail } from '../../../common/utils/normalize-email';
import { UsersService } from '../../users/users.service';
import type { UserUpdate } from '../../users/repositories/users.repository';
import type { ChangePasswordDto } from '../dto/change-password.dto';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import type { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
  ) {}

  async get(userId: string): Promise<ProfileResponseDto> {
    return this.toResponse(await this.requireUser(userId));
  }

  async update(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const current = await this.requireUser(userId);
    const patch: UserUpdate = {};

    if (dto.name) {
      const name = dto.name.trim();
      if (name !== current.name) {
        patch.name = name;
      }
    }

    if (dto.email) {
      const email = normalizeEmail(dto.email);
      if (email !== current.email) {
        const existing = await this.usersService.findByEmailIncludingDeleted(email);
        if (existing && existing.id !== userId) {
          throw new AppException(
            HttpStatus.CONFLICT,
            ErrorCode.EMAIL_ALREADY_EXISTS,
            'Já existe uma conta com este e-mail',
          );
        }
        patch.email = email;
      }
    }

    if (!patch.name && !patch.email) {
      return this.toResponse(current);
    }

    const updated = await this.usersService.update(userId, patch);
    return this.toResponse(updated);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.requireUser(userId);
    const valid = await this.passwordService.verify(user.passwordHash, dto.currentPassword);
    if (!valid) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_CREDENTIALS,
        'Senha atual incorreta',
      );
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new AppException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.BUSINESS_RULE,
        'A nova senha deve ser diferente da atual',
      );
    }

    const passwordHash = await this.passwordService.hash(dto.newPassword);
    await this.usersService.update(userId, { passwordHash });
  }

  private async requireUser(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Perfil não encontrado');
    }
    return user;
  }

  private toResponse(user: User): ProfileResponseDto {
    return { id: user.id, name: user.name, email: user.email };
  }
}
