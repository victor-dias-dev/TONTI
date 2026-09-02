export interface CivilDate {
  year: number;
  month: number;
  day: number;
}

export function zonedCivilDate(date: Date, timeZone: string): CivilDate {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return { year: read('year'), month: read('month'), day: read('day') };
}

export function offsetMsAt(date: Date, timeZone: string): number {
  const name = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
  })
    .formatToParts(date)
    .find((part) => part.type === 'timeZoneName')?.value;

  const match = name?.match(/GMT([+-])?(\d{1,2})(?::(\d{2}))?/);
  if (!match) {
    return 0;
  }

  const sign = match[1] === '-' ? -1 : 1;
  const hours = Number(match[2] ?? 0);
  const minutes = Number(match[3] ?? 0);
  return sign * (hours * 60 + minutes) * 60_000;
}

export function fromZonedCivil(
  year: number,
  month: number,
  day: number,
  timeZone: string,
  hour = 0,
  minute = 0,
  second = 0,
): Date {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
  const instant = new Date(utcGuess - offsetMsAt(new Date(utcGuess), timeZone));
  return new Date(utcGuess - offsetMsAt(instant, timeZone));
}

export function clampDay(year: number, month: number, day: number): number {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Math.min(day, lastDay);
}

export function addCalendarMonths(civil: CivilDate, delta: number): CivilDate {
  const date = new Date(Date.UTC(civil.year, civil.month - 1 + delta, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: 1 };
}

export function startOfMonth(date: Date, timeZone: string): Date {
  const { year, month } = zonedCivilDate(date, timeZone);
  return fromZonedCivil(year, month, 1, timeZone);
}

export function startOfNextMonth(date: Date, timeZone: string): Date {
  const { year, month } = zonedCivilDate(date, timeZone);
  const next = addCalendarMonths({ year, month, day: 1 }, 1);
  return fromZonedCivil(next.year, next.month, 1, timeZone);
}

export function monthRange(date: Date, timeZone: string): { start: Date; end: Date } {
  return { start: startOfMonth(date, timeZone), end: startOfNextMonth(date, timeZone) };
}

export function previousMonthRange(date: Date, timeZone: string): { start: Date; end: Date } {
  const start = startOfMonth(date, timeZone);
  const previousStart = addCalendarMonths(zonedCivilDate(start, timeZone), -1);
  return {
    start: fromZonedCivil(previousStart.year, previousStart.month, 1, timeZone),
    end: start,
  };
}

export function financialMonthRange(
  date: Date,
  timeZone: string,
  startDay = 1,
): { start: Date; end: Date } {
  const day = Math.min(Math.max(startDay, 1), 28);
  if (day <= 1) {
    return monthRange(date, timeZone);
  }

  const civil = zonedCivilDate(date, timeZone);
  let startYear = civil.year;
  let startMonth = civil.month;
  if (civil.day < day) {
    const previous = addCalendarMonths({ year: civil.year, month: civil.month, day: 1 }, -1);
    startYear = previous.year;
    startMonth = previous.month;
  }

  const start = fromZonedCivil(
    startYear,
    startMonth,
    clampDay(startYear, startMonth, day),
    timeZone,
  );
  const next = addCalendarMonths({ year: startYear, month: startMonth, day: 1 }, 1);
  const end = fromZonedCivil(next.year, next.month, clampDay(next.year, next.month, day), timeZone);
  return { start, end };
}

export function previousFinancialMonthRange(
  date: Date,
  timeZone: string,
  startDay = 1,
): { start: Date; end: Date } {
  const current = financialMonthRange(date, timeZone, startDay);
  const beforeStart = new Date(current.start.getTime() - 12 * 60 * 60 * 1000);
  return financialMonthRange(beforeStart, timeZone, startDay);
}

export function addDays(civil: CivilDate, days: number): CivilDate {
  const date = new Date(Date.UTC(civil.year, civil.month - 1, civil.day + days));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

export function civilOnDay(year: number, month: number, day: number, timeZone: string): Date {
  return fromZonedCivil(year, month, clampDay(year, month, day), timeZone);
}
