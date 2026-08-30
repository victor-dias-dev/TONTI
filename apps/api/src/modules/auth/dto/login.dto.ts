import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { normalizeEmail } from '../../../common/utils/normalize-email';

export class LoginDto {
  @ApiProperty({ example: 'victor@email.com' })
  @IsEmail()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? normalizeEmail(value) : value,
  )
  email!: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
