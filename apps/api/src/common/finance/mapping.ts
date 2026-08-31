import { AccountType, TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export type ApiTransactionType = 'expense' | 'income' | 'transfer';
export type ApiAccountKind = 'checking' | 'cash';

export function toApiTransactionType(type: TransactionType): ApiTransactionType {
  switch (type) {
    case TransactionType.INCOME:
      return 'income';
    case TransactionType.TRANSFER:
      return 'transfer';
    default:
      return 'expense';
  }
}

export function fromApiTransactionType(type: ApiTransactionType): TransactionType {
  switch (type) {
    case 'income':
      return TransactionType.INCOME;
    case 'transfer':
      return TransactionType.TRANSFER;
    default:
      return TransactionType.EXPENSE;
  }
}

export function toApiAccountKind(type: AccountType): ApiAccountKind {
  return type === AccountType.CASH ? 'cash' : 'checking';
}

export function fromApiAccountKind(kind: ApiAccountKind): AccountType {
  return kind === 'cash' ? AccountType.CASH : AccountType.CHECKING;
}

export function parseCardInstitution(institution: string | null | undefined): {
  brand: string;
  lastDigits: string;
} {
  const value = institution?.trim() ?? '';
  const match = value.match(/^(.*?)(?:\s+(\d{4}))$/);
  if (match?.[1] && match[2]) {
    return { brand: match[1].trim() || 'Cartão', lastDigits: match[2] };
  }
  return { brand: value || 'Cartão', lastDigits: '' };
}

export function formatCardInstitution(brand: string, lastDigits: string): string {
  return `${brand.trim()} ${lastDigits}`.trim();
}

export function accountIcon(type: AccountType): 'bank' | 'cash' | 'wallet' {
  if (type === AccountType.CASH) return 'cash';
  if (type === AccountType.CREDIT_CARD) return 'wallet';
  return 'bank';
}

export function balanceDelta(
  accountType: AccountType,
  transactionType: TransactionType,
  amount: Decimal,
): Decimal {
  const incoming = transactionType === TransactionType.INCOME;

  if (accountType === AccountType.CREDIT_CARD) {
    return incoming ? amount.neg() : amount;
  }

  return incoming ? amount : amount.neg();
}
