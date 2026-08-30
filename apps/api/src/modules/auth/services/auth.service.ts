import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { LoginResponse, PublicUser } from '@tonti/types';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { PasswordService } from '../../../common/security/password.service';
import { normalizeEmail } from '../../../common/utils/normalize-email';
import { UsersService } from '../../users/users.service';
import type { LoginDto } from '../dto/login.dto';
import type { RegisterDto } from '../dto/register.dto';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<PublicUser> {
    const email = normalizeEmail(dto.email);
    const existing = await this.usersService.findByEmailIncludingDeleted(email);

    if (existing) {
      throw new AppException(
        HttpStatus.CONFLICT,
        ErrorCode.EMAIL_ALREADY_EXISTS,
        'Email already in use',
      );
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.usersService.create({
      email,
      name: dto.name.trim(),
      passwordHash,
    });

    return this.usersService.toPublicUser(user);
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const email = normalizeEmail(dto.email);
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_CREDENTIALS,
        'Invalid credentials',
      );
    }

    const valid = await this.passwordService.verify(user.passwordHash, dto.password);

    if (!valid) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_CREDENTIALS,
        'Invalid credentials',
      );
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
      user: this.usersService.toPublicUser(user),
    };
  }

  async getMe(userId: string): Promise<PublicUser> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new AppException(HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, 'Unauthorized');
    }

    return this.usersService.toPublicUser(user);
  }
}
