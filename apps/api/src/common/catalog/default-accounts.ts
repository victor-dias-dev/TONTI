import { AccountType } from '@prisma/client';

export const DEFAULT_ACCOUNTS: Array<{
  name: string;
  type: AccountType;
}> = [{ name: 'Carteira', type: AccountType.CASH }];
