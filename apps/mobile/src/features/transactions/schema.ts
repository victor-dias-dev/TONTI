import { z } from 'zod';

export const newTransactionSchema = z.object({
  type: z.enum(['expense', 'income', 'transfer']),
  amountCents: z
    .string()
    .regex(/^\d+$/, 'Informe um valor')
    .refine((value) => BigInt(value) > 0n, 'Informe um valor'),
  description: z.string().trim().min(2, 'Informe a descrição'),
  categoryId: z.string().min(1, 'Selecione a categoria'),
  accountId: z.string().min(1, 'Selecione a conta'),
  occurredAt: z.string().min(1, 'Selecione a data'),
  notes: z.string().optional(),
  repeat: z.boolean(),
  installments: z.string().optional(),
});

export type NewTransactionValues = z.infer<typeof newTransactionSchema>;
