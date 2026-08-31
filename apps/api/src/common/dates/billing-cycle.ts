import {
  addCalendarMonths,
  addDays,
  civilOnDay,
  fromZonedCivil,
  zonedCivilDate,
  type CivilDate,
} from './zoned-time';

export interface BillingCycle {
  start: Date;
  end: Date;
  closingDate: Date;
  dueDate: Date;
  bestPurchaseDate: Date;
  id: string;
}

function cycleId(closingDate: Date, timeZone: string): string {
  const { year, month } = zonedCivilDate(closingDate, timeZone);
  return `${year}-${String(month).padStart(2, '0')}`;
}

function dueCivil(closing: CivilDate, dueDay: number): CivilDate {
  if (dueDay <= closing.day) {
    const next = addCalendarMonths(closing, 1);
    return { year: next.year, month: next.month, day: dueDay };
  }

  return { year: closing.year, month: closing.month, day: dueDay };
}

export function billingCycleForClosing(
  closing: CivilDate,
  closingDay: number,
  dueDay: number,
  timeZone: string,
): BillingCycle {
  const closingDate = civilOnDay(closing.year, closing.month, closingDay, timeZone);
  const previous = addCalendarMonths(closing, -1);
  const previousClosing = civilOnDay(previous.year, previous.month, closingDay, timeZone);
  const startDay = addDays(zonedCivilDate(previousClosing, timeZone), 1);
  const start = fromZonedCivil(startDay.year, startDay.month, startDay.day, timeZone);
  const endDay = addDays(zonedCivilDate(closingDate, timeZone), 1);
  const end = fromZonedCivil(endDay.year, endDay.month, endDay.day, timeZone);
  const due = dueCivil(zonedCivilDate(closingDate, timeZone), dueDay);
  const dueDate = civilOnDay(due.year, due.month, due.day, timeZone);

  return {
    start,
    end,
    closingDate,
    dueDate,
    bestPurchaseDate: end,
    id: cycleId(closingDate, timeZone),
  };
}

export function currentBillingCycle(
  now: Date,
  closingDay: number,
  dueDay: number,
  timeZone: string,
): BillingCycle {
  const today = zonedCivilDate(now, timeZone);
  let closing: CivilDate = { year: today.year, month: today.month, day: closingDay };

  if (today.day > closingDay) {
    closing = addCalendarMonths(closing, 1);
  }

  return billingCycleForClosing(closing, closingDay, dueDay, timeZone);
}

export function recentBillingCycles(
  now: Date,
  closingDay: number,
  dueDay: number,
  timeZone: string,
  count = 3,
): BillingCycle[] {
  const current = currentBillingCycle(now, closingDay, dueDay, timeZone);
  const cycles: BillingCycle[] = [current];
  let cursor = zonedCivilDate(current.closingDate, timeZone);

  for (let index = 1; index < count; index += 1) {
    cursor = addCalendarMonths(cursor, -1);
    cycles.push(billingCycleForClosing(cursor, closingDay, dueDay, timeZone));
  }

  return cycles;
}
