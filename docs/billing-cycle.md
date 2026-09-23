# Billing cycle

A Brazilian card or paycheck often closes on a day that is not the first of the month. Tonti calls that window the financial month.

## What is stored

- Timestamps are UTC (`TIMESTAMPTZ`).
- The user has a timezone and a `periodStartDay` from 1 to 28.
- The day is capped at 28 so February does not skip a close.

Preferences accept `periodStartDay` in [apps/api/src/modules/preferences/dto/update-preferences.dto.ts](../apps/api/src/modules/preferences/dto/update-preferences.dto.ts). The range itself is `financialMonthRange` in [apps/api/src/common/dates/zoned-time.ts](../apps/api/src/common/dates/zoned-time.ts).

## How the window is chosen

`periodStartDay` of 1 is the calendar month in the user's timezone.

Any later day starts the window on that day. If today is still before the start day, the open window began last month. A start day of 5 on 23 September covers 5 September through 5 October. The same start day on 3 September covers 5 August through 5 September.

Dashboard, budgets, categories, transactions, and the assistant all read this window. The assistant compares the open window with the previous one. It does not call a language model.

## Why the timezone is the user's

Brazil does not have one offset. `America/Sao_Paulo`, `America/Manaus`, and `America/Noronha` disagree on when a civil day begins. The API converts the start and end instants with the user's timezone and stores the result in UTC. Display converts back on the device.

Do not assume the server clock is Brasília time.
