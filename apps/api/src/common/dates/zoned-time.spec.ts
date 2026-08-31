import { fromZonedCivil, monthRange, zonedCivilDate } from './zoned-time';

describe('zoned-time', () => {
  const timeZone = 'America/Sao_Paulo';

  it('converts São Paulo midnight to UTC', () => {
    const instant = fromZonedCivil(2026, 8, 1, timeZone);
    expect(instant.toISOString()).toBe('2026-08-01T03:00:00.000Z');
  });

  it('reads the civil date in the user timezone', () => {
    const instant = new Date('2026-08-01T02:30:00.000Z');
    expect(zonedCivilDate(instant, timeZone)).toEqual({ year: 2026, month: 7, day: 31 });
  });

  it('builds an exclusive month range in the user timezone', () => {
    const { start, end } = monthRange(new Date('2026-08-15T12:00:00.000Z'), timeZone);
    expect(start.toISOString()).toBe('2026-08-01T03:00:00.000Z');
    expect(end.toISOString()).toBe('2026-09-01T03:00:00.000Z');
  });
});
