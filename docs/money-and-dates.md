# Money and dates

These rules apply to every future financial module.

## Money

Never persist or compute money with `float` or `double`.

Use an exact representation:

- PostgreSQL: `DECIMAL` via Prisma `Decimal`
- Precision `19`, scale `4` (`DECIMAL(19, 4)`)
- Currency as a separate ISO 4217 code (`BRL`, not encoded in the amount)

Scale 4 leaves room for splits, FX, and rounding without using floats. Display in `pt-BR` uses two fraction digits for BRL.

Integer minor units (centavos) are acceptable for a single currency. Decimal + currency code is the default because the product may support other currencies later.

Constants live in `@tonti/config` (`MONEY`).

## Dates

- Persist timestamps in UTC (`TIMESTAMPTZ` in PostgreSQL)
- Convert to the device timezone only in the client
- Do not assume a single Brazilian timezone on the backend

Brazil has more than one offset. Store UTC; present locally.
