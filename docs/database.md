# Database tables

PostgreSQL via Prisma. Schema: `apps/api/prisma/schema.prisma`. Migrations: `apps/api/prisma/migrations`.

Money and timestamps follow `docs/money-and-dates.md`. This document covers tables, ownership, and relationships.

## Isolation

A user owns every financial row. Queries must filter by `user_id`. The API must never return another user's records.

```
User A → accounts, categories, transactions, budgets, goals, subscriptions, refresh_tokens of A
User B → the same, isolated
```

This is not multi-tenant B2B. Household / shared accounts may appear later; do not encode that model now, and do not block it.

Categories are copied per user (`is_system` marks the defaults). There is no global category catalog.

## Overview

```
users
  ├── accounts ──────────────┐
  ├── categories ────────────┤
  ├── transactions ──────────┼──► accounts, categories
  ├── budgets ───────────────┘
  ├── goals
  ├── subscriptions ──────────► accounts, categories
  └── refresh_tokens
```

| Table            | Owner     | Role                               |
| ---------------- | --------- | ---------------------------------- |
| `users`          | —         | Identity, preferences, soft delete |
| `refresh_tokens` | `user_id` | Hashed refresh tokens              |
| `accounts`       | `user_id` | Bank accounts, cash, credit cards  |
| `categories`     | `user_id` | Income / expense labels            |
| `transactions`   | `user_id` | Ledger entries                     |
| `budgets`        | `user_id` | Monthly cap per category           |
| `goals`          | `user_id` | Savings targets                    |
| `subscriptions`  | `user_id` | Recurring charges                  |

IDs are UUID. Table and column names are `snake_case`. Prisma models use camelCase.

## Relationships

```
users 1 ─── N accounts
users 1 ─── N categories
users 1 ─── N transactions
users 1 ─── N budgets
users 1 ─── N goals
users 1 ─── N subscriptions
users 1 ─── N refresh_tokens

accounts  1 ─── N transactions
accounts  1 ─── N subscriptions
categories 1 ─── N transactions
categories 1 ─── N budgets
categories 1 ─── N subscriptions
```

`transfer_id` and `installment_group_id` on `transactions` are grouping UUIDs, not foreign keys. Two sides of a transfer share the same `transfer_id`. Installments of one purchase share the same `installment_group_id`.

### Delete behavior

| From                        | On user delete | On account / category delete |
| --------------------------- | -------------- | ---------------------------- |
| Owned financial rows        | `CASCADE`      | —                            |
| `transactions.account_id`   | —              | `RESTRICT`                   |
| `transactions.category_id`  | —              | `RESTRICT`                   |
| `budgets.category_id`       | —              | `RESTRICT`                   |
| `subscriptions.account_id`  | —              | `RESTRICT`                   |
| `subscriptions.category_id` | —              | `RESTRICT`                   |

Users are soft-deleted (`deleted_at`). Cascade only runs on a hard delete. Deactivating an account (`is_active = false`) keeps history.

## Conventions

- Money: `DECIMAL(19, 4)`. Currency lives on `users.currency` (ISO 4217, default `BRL`), not on each amount.
- Amounts on transactions, budgets, goals, and subscriptions are **positive**. Sign comes from `type` (`INCOME` / `EXPENSE` / `TRANSFER`).
- Timestamps: `TIMESTAMPTZ` in UTC. Calendar fields (`month`, `target_date`, `next_charge_date`) are `DATE`.
- `created_at` / `updated_at` on mutable tables. `refresh_tokens` has `created_at` and `revoked_at` instead of `updated_at`.

## Tables

### `users`

Identity and display preferences.

| Column          | Type          | Notes                                          |
| --------------- | ------------- | ---------------------------------------------- |
| `id`            | `UUID` PK     |                                                |
| `name`          | `TEXT`        |                                                |
| `email`         | `TEXT`        | Unique                                         |
| `password_hash` | `TEXT`        | Argon2                                         |
| `avatar_url`    | `TEXT`        | Optional                                       |
| `currency`      | `CHAR(3)`     | Default `BRL`                                  |
| `locale`        | `TEXT`        | Default `pt-BR`                                |
| `timezone`      | `TEXT`        | Default `America/Sao_Paulo`                    |
| `created_at`    | `TIMESTAMPTZ` |                                                |
| `updated_at`    | `TIMESTAMPTZ` |                                                |
| `deleted_at`    | `TIMESTAMPTZ` | Soft delete. Soft-deleted users cannot log in. |

### `refresh_tokens`

Auth session refresh. Store a hash, never the raw token.

| Column       | Type          | Notes             |
| ------------ | ------------- | ----------------- |
| `id`         | `UUID` PK     |                   |
| `user_id`    | `UUID` FK     | → `users`         |
| `token_hash` | `TEXT` unique |                   |
| `expires_at` | `TIMESTAMPTZ` |                   |
| `revoked_at` | `TIMESTAMPTZ` | Null while active |
| `created_at` | `TIMESTAMPTZ` |                   |

### `accounts`

Checking, savings, cash, or credit card. Credit fields apply to `CREDIT_CARD`.

| Column            | Type            | Notes                                                                                        |
| ----------------- | --------------- | -------------------------------------------------------------------------------------------- |
| `id`              | `UUID` PK       |                                                                                              |
| `user_id`         | `UUID` FK       | → `users`                                                                                    |
| `name`            | `TEXT`          |                                                                                              |
| `type`            | `account_type`  | `CHECKING`, `SAVINGS`, `CASH`, `CREDIT_CARD`                                                 |
| `institution`     | `TEXT`          | Optional bank / issuer                                                                       |
| `initial_balance` | `DECIMAL(19,4)` | Default `0`                                                                                  |
| `current_balance` | `DECIMAL(19,4)` | Default `0`                                                                                  |
| `credit_limit`    | `DECIMAL(19,4)` | Credit cards only                                                                            |
| `closing_day`     | `INTEGER`       | 1–31, credit cards                                                                           |
| `due_day`         | `INTEGER`       | 1–31, credit cards                                                                           |
| `brand`           | `TEXT`          | Optional. Credit card brand (Visa, Mastercard). Also kept in `institution` as `"Visa 4412"`. |
| `last_four`       | `VARCHAR(4)`    | Optional last four digits of the card.                                                       |
| `is_active`       | `BOOLEAN`       | Default `true`                                                                               |
| `created_at`      | `TIMESTAMPTZ`   |                                                                                              |
| `updated_at`      | `TIMESTAMPTZ`   |                                                                                              |

### `categories`

Per-user labels. System defaults are rows with `is_system = true`, still owned by the user.

| Column       | Type            | Notes               |
| ------------ | --------------- | ------------------- |
| `id`         | `UUID` PK       |                     |
| `user_id`    | `UUID` FK       | → `users`           |
| `name`       | `TEXT`          |                     |
| `type`       | `category_type` | `INCOME`, `EXPENSE` |
| `icon`       | `TEXT`          |                     |
| `color`      | `TEXT`          |                     |
| `is_system`  | `BOOLEAN`       | Default `false`     |
| `created_at` | `TIMESTAMPTZ`   |                     |
| `updated_at` | `TIMESTAMPTZ`   |                     |

### `transactions`

Ledger. `amount` is always positive. `type` decides direction.

| Column                 | Type                 | Notes                                                    |
| ---------------------- | -------------------- | -------------------------------------------------------- |
| `id`                   | `UUID` PK            |                                                          |
| `user_id`              | `UUID` FK            | → `users`                                                |
| `account_id`           | `UUID` FK            | → `accounts`                                             |
| `category_id`          | `UUID` FK            | → `categories`                                           |
| `type`                 | `transaction_type`   | `INCOME`, `EXPENSE`, `TRANSFER`                          |
| `amount`               | `DECIMAL(19,4)`      | `> 0`                                                    |
| `description`          | `TEXT`               |                                                          |
| `date`                 | `TIMESTAMPTZ`        | When it occurred (UTC)                                   |
| `status`               | `transaction_status` | `PENDING`, `CONFIRMED`, `CANCELLED`. Default `CONFIRMED` |
| `merchant`             | `TEXT`               | Optional                                                 |
| `transfer_id`          | `UUID`               | Shared by both legs of a transfer                        |
| `installment_group_id` | `UUID`               | Shared by installments of one purchase                   |
| `created_at`           | `TIMESTAMPTZ`        |                                                          |
| `updated_at`           | `TIMESTAMPTZ`        |                                                          |

### `budgets`

One planned amount per user, category, and month.

| Column        | Type            | Notes                                               |
| ------------- | --------------- | --------------------------------------------------- |
| `id`          | `UUID` PK       |                                                     |
| `user_id`     | `UUID` FK       | → `users`                                           |
| `category_id` | `UUID` FK       | → `categories`                                      |
| `month`       | `DATE`          | First day of the month. Unique with user + category |
| `amount`      | `DECIMAL(19,4)` | `>= 0`                                              |
| `created_at`  | `TIMESTAMPTZ`   |                                                     |
| `updated_at`  | `TIMESTAMPTZ`   |                                                     |

Spent amount is derived from `transactions`, not stored here.

### `goals`

| Column           | Type            | Notes                                                |
| ---------------- | --------------- | ---------------------------------------------------- |
| `id`             | `UUID` PK       |                                                      |
| `user_id`        | `UUID` FK       | → `users`                                            |
| `name`           | `TEXT`          |                                                      |
| `target_amount`  | `DECIMAL(19,4)` | `> 0`                                                |
| `current_amount` | `DECIMAL(19,4)` | Default `0`, `>= 0`                                  |
| `target_date`    | `DATE`          | Optional                                             |
| `status`         | `goal_status`   | `ACTIVE`, `COMPLETED`, `CANCELLED`. Default `ACTIVE` |
| `created_at`     | `TIMESTAMPTZ`   |                                                      |
| `updated_at`     | `TIMESTAMPTZ`   |                                                      |

### `subscriptions`

Recurring charges. Generating the actual ledger row is application work; this table is the schedule.

| Column             | Type                     | Notes                                             |
| ------------------ | ------------------------ | ------------------------------------------------- |
| `id`               | `UUID` PK                |                                                   |
| `user_id`          | `UUID` FK                | → `users`                                         |
| `account_id`       | `UUID` FK                | → `accounts`                                      |
| `category_id`      | `UUID` FK                | → `categories`                                    |
| `name`             | `TEXT`                   |                                                   |
| `amount`           | `DECIMAL(19,4)`          | `> 0`                                             |
| `frequency`        | `subscription_frequency` | `WEEKLY`, `MONTHLY`, `QUARTERLY`, `YEARLY`        |
| `next_charge_date` | `DATE`                   |                                                   |
| `status`           | `subscription_status`    | `ACTIVE`, `PAUSED`, `CANCELLED`. Default `ACTIVE` |
| `created_at`       | `TIMESTAMPTZ`            |                                                   |
| `updated_at`       | `TIMESTAMPTZ`            |                                                   |

## Enums

| Enum                     | Values                                       |
| ------------------------ | -------------------------------------------- |
| `account_type`           | `CHECKING`, `SAVINGS`, `CASH`, `CREDIT_CARD` |
| `category_type`          | `INCOME`, `EXPENSE`                          |
| `transaction_type`       | `INCOME`, `EXPENSE`, `TRANSFER`              |
| `transaction_status`     | `PENDING`, `CONFIRMED`, `CANCELLED`          |
| `goal_status`            | `ACTIVE`, `COMPLETED`, `CANCELLED`           |
| `subscription_frequency` | `WEEKLY`, `MONTHLY`, `QUARTERLY`, `YEARLY`   |
| `subscription_status`    | `ACTIVE`, `PAUSED`, `CANCELLED`              |

## Indexes

Foreign keys are indexed. Extra indexes:

| Table            | Index                                              | Why                           |
| ---------------- | -------------------------------------------------- | ----------------------------- |
| `accounts`       | `(user_id, is_active)`                             | List active accounts          |
| `categories`     | `(user_id, type)`                                  | Filter income vs expense      |
| `transactions`   | `(user_id, date)`, `(account_id, date)`            | Timeline and account extract  |
| `transactions`   | `transfer_id`, `installment_group_id`              | Group related rows            |
| `budgets`        | unique `(user_id, category_id, month)`             | One budget per category/month |
| `budgets`        | `(user_id, month)`                                 | Planning for a month          |
| `goals`          | `(user_id, status)`                                | Active goals                  |
| `subscriptions`  | `(user_id, status)`, `(user_id, next_charge_date)` | Due charges                   |
| `refresh_tokens` | unique `token_hash`, `(user_id, expires_at)`       | Lookup and expiry             |

## Checks

Enforced in PostgreSQL (not in the Prisma schema):

- `accounts.closing_day` / `due_day`: null or 1–31
- `accounts.credit_limit`: null or `>= 0`
- `transactions.amount` / `subscriptions.amount` / `goals.target_amount`: `> 0`
- `budgets.amount` / `goals.current_amount`: `>= 0`
- `budgets.month`: day of month is `1`
