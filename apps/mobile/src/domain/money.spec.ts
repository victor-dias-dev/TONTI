import { afterEach, describe, expect, it } from '@jest/globals';
import { formatMoney, setBalancesHidden, setMoneyCurrency } from './money';

describe('formatMoney', () => {
  afterEach(() => {
    setBalancesHidden(false);
    setMoneyCurrency('BRL');
  });

  it('formats centavos with pt-BR grouping', () => {
    expect(formatMoney('4590')).toBe('R$ 45,90');
    expect(formatMoney('123456')).toBe('R$ 1.234,56');
  });

  it('prefixes a minus sign for a negative amount', () => {
    expect(formatMoney('-4590')).toBe('- R$ 45,90');
  });

  it('masks the amount when balances are hidden', () => {
    setBalancesHidden(true);
    expect(formatMoney('4590')).toBe('R$ ••••');
    expect(formatMoney('-4590')).toBe('- R$ ••••');
  });
});
