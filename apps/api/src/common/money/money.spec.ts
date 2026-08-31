import { Decimal } from '@prisma/client/runtime/library';
import { centsToDecimal, decimalToCents, sumDecimals } from './money';

describe('money', () => {
  it('converts cents to decimal without using floats', () => {
    expect(centsToDecimal('845000').toFixed(4)).toBe('8450.0000');
    expect(centsToDecimal('1').toFixed(4)).toBe('0.0100');
  });

  it('converts decimal to integer cents as a string', () => {
    expect(decimalToCents(new Decimal('8450.0000'))).toBe('845000');
    expect(decimalToCents(new Decimal('0.01'))).toBe('1');
    expect(decimalToCents(null)).toBe('0');
  });

  it('rounds half up to the nearest cent', () => {
    expect(decimalToCents(new Decimal('10.006'))).toBe('1001');
    expect(decimalToCents(new Decimal('10.004'))).toBe('1000');
  });

  it('sums decimal values exactly', () => {
    const total = sumDecimals(['10.10', '0.05', null]);
    expect(decimalToCents(total)).toBe('1015');
  });
});
