import { AccountType, type Account, type Transaction } from '@prisma/client';
import { decimalToCents } from '../money/money';
import { toApiTransactionType } from './mapping';

export interface TransactionView {
  id: string;
  description: string;
  amountCents: string;
  type: 'expense' | 'income' | 'transfer';
  categoryId: string;
  accountId: string;
  cardId?: string;
  notes?: string;
  occurredAt: string;
}

export function toTransactionView(
  transaction: Transaction,
  account?: Pick<Account, 'type'> | null,
): TransactionView {
  const isCard = account?.type === AccountType.CREDIT_CARD;

  return {
    id: transaction.id,
    description: transaction.description,
    amountCents: decimalToCents(transaction.amount),
    type: toApiTransactionType(transaction.type),
    categoryId: transaction.categoryId,
    accountId: transaction.accountId,
    ...(isCard ? { cardId: transaction.accountId } : {}),
    ...(transaction.merchant ? { notes: transaction.merchant } : {}),
    occurredAt: transaction.date.toISOString(),
  };
}
