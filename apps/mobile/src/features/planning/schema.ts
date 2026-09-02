import { z } from 'zod';

export const newBudgetSchema = z.object({
  categoryId: z.string().min(1, 'Selecione a categoria'),
  amountCents: z
    .string()
    .regex(/^\d+$/, 'Informe um valor')
    .refine((value) => BigInt(value) > 0n, 'Informe um valor'),
});

export type NewBudgetValues = z.infer<typeof newBudgetSchema>;
