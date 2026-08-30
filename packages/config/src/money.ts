/**
 * Monetary amounts must never use IEEE-754 floats.
 * Persist with PostgreSQL DECIMAL via Prisma Decimal. See docs/money-and-dates.md.
 */
export const MONEY = {
  decimalPrecision: 19,
  decimalScale: 4,
} as const;
