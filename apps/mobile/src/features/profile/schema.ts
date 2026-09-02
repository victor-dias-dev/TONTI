import { z } from 'zod';
import { strings } from '../../constants/strings';

export const editProfileSchema = z.object({
  name: z.string().trim().min(2, strings.errors.shortName).max(100),
  email: z.string().trim().email(strings.errors.invalidEmail),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, strings.errors.shortPassword),
    newPassword: z.string().min(8, strings.errors.shortPassword),
    confirmPassword: z.string().min(8, strings.errors.shortPassword),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: strings.errors.passwordMismatch,
    path: ['confirmPassword'],
  });

export type EditProfileValues = z.infer<typeof editProfileSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
