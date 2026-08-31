import { DEFAULT_CURRENCY } from '@tonti/config';

export type MoneyCents = string;

export function formatMoney(
  cents: MoneyCents,
  options?: { sign?: 'auto' | 'always' | 'never' },
): string {
  const signMode = options?.sign ?? 'auto';
  const negative = cents.startsWith('-');
  const abs = negative ? cents.slice(1) : cents.replace(/^\+/, '');
  const digits = abs.replace(/\D/g, '') || '0';
  const padded = digits.padStart(3, '0');
  const whole = padded.slice(0, -2);
  const fraction = padded.slice(-2);
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const prefix = signMode === 'never' ? '' : negative ? '- ' : signMode === 'always' ? '+ ' : '';
  return `${prefix}R$ ${grouped},${fraction}`;
}

export function formatMoneyCompact(cents: MoneyCents): string {
  return formatMoney(cents, { sign: 'never' }).replace(',00', '');
}

export function moneyCurrency(): typeof DEFAULT_CURRENCY {
  return DEFAULT_CURRENCY;
}

export function percentOf(spentCents: MoneyCents, plannedCents: MoneyCents): number {
  const spent = BigInt(spentCents.replace(/[+-]/g, '') || '0');
  const planned = BigInt(plannedCents.replace(/[+-]/g, '') || '0');
  if (planned === 0n) return 0;
  return Number((spent * 100n) / planned);
}

export function digitsToCents(digits: string): MoneyCents {
  return digits.replace(/\D/g, '').replace(/^0+(?=\d)/, '') || '0';
}

export function appendMoneyDigit(cents: MoneyCents, digit: string): MoneyCents {
  if (!/^\d$/.test(digit)) return cents;
  return digitsToCents(`${cents}${digit}`);
}

export function removeMoneyDigit(cents: MoneyCents): MoneyCents {
  return digitsToCents(cents.slice(0, -1));
}
