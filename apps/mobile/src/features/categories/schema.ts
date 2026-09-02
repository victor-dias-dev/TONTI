import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome da categoria').max(80),
  icon: z.string().min(1),
  iconBg: z.string().min(1),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
