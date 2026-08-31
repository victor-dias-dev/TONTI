import { currentBillingCycle } from './billing-cycle';

describe('billing-cycle', () => {
  const timeZone = 'America/Sao_Paulo';

  it('keeps purchases on or before closing day in the current invoice', () => {
    const cycle = currentBillingCycle(new Date('2026-08-05T15:00:00.000Z'), 5, 10, timeZone);
    expect(cycle.id).toBe('2026-08');
    expect(cycle.start.toISOString()).toBe('2026-07-06T03:00:00.000Z');
    expect(cycle.end.toISOString()).toBe('2026-08-06T03:00:00.000Z');
    expect(cycle.dueDate.toISOString()).toBe('2026-08-10T03:00:00.000Z');
  });

  it('opens the next invoice after the closing day', () => {
    const cycle = currentBillingCycle(new Date('2026-08-06T03:00:00.000Z'), 5, 10, timeZone);
    expect(cycle.id).toBe('2026-09');
    expect(cycle.start.toISOString()).toBe('2026-08-06T03:00:00.000Z');
    expect(cycle.dueDate.toISOString()).toBe('2026-09-10T03:00:00.000Z');
    expect(cycle.bestPurchaseDate.toISOString()).toBe(cycle.end.toISOString());
  });

  it('moves the due date to the next month when it falls before closing', () => {
    const cycle = currentBillingCycle(new Date('2026-08-20T15:00:00.000Z'), 20, 5, timeZone);
    expect(cycle.id).toBe('2026-08');
    expect(cycle.dueDate.toISOString()).toBe('2026-09-05T03:00:00.000Z');
  });
});
