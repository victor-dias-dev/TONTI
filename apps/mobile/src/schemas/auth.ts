import { z } from 'zod';
import { strings } from '../constants/strings';

export const loginSchema = z.object({
  email: z.string().email(strings.errors.invalidEmail),
  password: z.string().min(8, strings.errors.shortPassword),
});

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, strings.errors.shortName).max(100),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
