import { Decimal } from '@prisma/client/runtime/library';

const CENTS_SCALE = 100;

export function centsToDecimal(cents: string): Decimal {
  return new Decimal(cents).div(CENTS_SCALE);
}

export function decimalToCents(value: Decimal | string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '0';
  }

  return new Decimal(value).mul(CENTS_SCALE).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toFixed(0);
}

export function zeroDecimal(): Decimal {
  return new Decimal(0);
}

export function sumDecimals(values: Array<Decimal | string | number | null | undefined>): Decimal {
  return values.reduce<Decimal>((total, value) => total.plus(value ?? 0), zeroDecimal());
}
