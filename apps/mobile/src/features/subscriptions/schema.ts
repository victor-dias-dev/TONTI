import { z } from 'zod';

export const newSubscriptionSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome da assinatura').max(80),
  amountCents: z
    .string()
    .regex(/^\d+$/, 'Informe um valor')
    .refine((value) => BigInt(value) > 0n, 'Informe um valor'),
  accountId: z.string().min(1, 'Selecione a conta'),
  categoryId: z.string().min(1, 'Selecione a categoria'),
  frequency: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  nextChargeDate: z.string().min(1, 'Selecione a data'),
});

export type NewSubscriptionValues = z.infer<typeof newSubscriptionSchema>;
