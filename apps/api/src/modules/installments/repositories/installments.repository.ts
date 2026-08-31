import { type Category, type Transaction } from '@prisma/client';

export type InstallmentTransaction = Transaction & {
  category: Pick<Category, 'icon'>;
};

export abstract class InstallmentsRepository {
  abstract findGrouped(userId: string): Promise<InstallmentTransaction[]>;
  abstract findGroup(userId: string, groupId: string): Promise<InstallmentTransaction[]>;
}
