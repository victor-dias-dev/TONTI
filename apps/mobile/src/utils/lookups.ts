import type { Account, Category, Transaction } from '../domain';

export function findCategory(categories: Category[] | undefined, id: string) {
  return categories?.find((item) => item.id === id);
}

export function findAccount(accounts: Account[] | undefined, id: string) {
  return accounts?.find((item) => item.id === id);
}

export function groupTransactionsByDate(transactions: Transaction[]) {
  const groups = new Map<string, Transaction[]>();
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  for (const transaction of transactions) {
    const date = new Date(transaction.occurredAt);
    const key = isSameDay(date, today)
      ? 'Hoje'
      : isSameDay(date, yesterday)
        ? 'Ontem'
        : date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    const list = groups.get(key) ?? [];
    list.push(transaction);
    groups.set(key, list);
  }
  return Array.from(groups.entries());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function firstName(name: string | undefined, fallback = 'Victor') {
  if (!name) return fallback;
  return name.split(' ')[0] ?? fallback;
}

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export function monthLabel(year: number, monthIndex: number) {
  return `${months[monthIndex]} ${year}`;
}
