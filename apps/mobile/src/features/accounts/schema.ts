import { z } from 'zod';

export const newCardSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome do cartão').max(80),
  brand: z.string().min(2, 'Selecione a bandeira'),
  lastDigits: z.string().regex(/^\d{4}$/, 'Informe os 4 últimos dígitos'),
  limitCents: z
    .string()
    .regex(/^\d+$/, 'Informe o limite')
    .refine((value) => BigInt(value) > 0n, 'Informe o limite'),
  closingDay: z.string().min(1, 'Selecione o dia de fechamento'),
  dueDay: z.string().min(1, 'Selecione o dia de vencimento'),
});

export type NewCardValues = z.infer<typeof newCardSchema>;
