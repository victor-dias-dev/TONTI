import { addDays, zonedCivilDate, type CivilDate } from '../dates/zoned-time';

const MONTHS = [
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

const SHORT_MONTHS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

export function monthLabel(date: Date, timeZone: string): string {
  const { year, month } = zonedCivilDate(date, timeZone);
  return `${MONTHS[month - 1]} ${year}`;
}

export function shortMonthLabel(date: Date, timeZone: string): string {
  const { month } = zonedCivilDate(date, timeZone);
  const label = SHORT_MONTHS[month - 1] ?? '';
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function dayMonthLabel(date: Date, timeZone: string): string {
  const { day, month } = zonedCivilDate(date, timeZone);
  return `${day} ${SHORT_MONTHS[month - 1]}`;
}

export function dueRelativeLabel(due: Date, now: Date, timeZone: string): string {
  const dueCivil = zonedCivilDate(due, timeZone);
  const today = zonedCivilDate(now, timeZone);

  if (sameCivil(dueCivil, today)) {
    return 'Hoje';
  }

  if (sameCivil(dueCivil, addDays(today, 1))) {
    return 'Amanhã';
  }

  return `${String(dueCivil.day).padStart(2, '0')}/${String(dueCivil.month).padStart(2, '0')}`;
}

export function formatPercentLabel(spent: bigint, planned: bigint): string {
  if (planned === 0n) {
    return spent === 0n ? '0%' : '100%';
  }

  return `${(spent * 100n) / planned}%`;
}

export function fullMonthName(month: number): string {
  return MONTHS[month - 1] ?? '';
}

export function occurredAtLabel(date: Date, timeZone: string): string {
  const { day, month } = zonedCivilDate(date, timeZone);
  const short = SHORT_MONTHS[month - 1] ?? '';
  const monthText = `${short.charAt(0).toUpperCase()}${short.slice(1)}`;
  const time = new Intl.DateTimeFormat('pt-BR', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
  return `${day} de ${monthText}, ${time}`;
}

export function formatBrlFromCents(cents: string, compact = false): string {
  const negative = cents.startsWith('-');
  const digits = cents.replace(/\D/g, '') || '0';
  const padded = digits.padStart(3, '0');
  const whole = padded.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const fraction = padded.slice(-2);
  const amount = compact && fraction === '00' ? whole : `${whole},${fraction}`;
  return `${negative ? '- ' : ''}R$ ${amount}`;
}

export function formatVariationLabel(current: bigint, previous: bigint): string {
  if (previous === 0n) {
    return current === 0n ? '0%' : '+100%';
  }

  const tenths = ((current - previous) * 1000n) / previous;
  const negative = tenths < 0n;
  const abs = negative ? -tenths : tenths;
  return `${negative ? '-' : '+'}${abs / 10n}.${abs % 10n}%`;
}

function sameCivil(left: CivilDate, right: CivilDate): boolean {
  return left.year === right.year && left.month === right.month && left.day === right.day;
}
