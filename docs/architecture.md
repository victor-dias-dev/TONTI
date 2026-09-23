# Architecture

Tonti is a personal finance app for one person in Brazil. This document describes the modules that exist today and the constraints new ones must follow.

## Repository

Turborepo + pnpm workspace.

- `apps/api` — NestJS REST API
- `apps/mobile` — Expo / React Native client
- `packages/types` — shared TypeScript contracts
- `packages/config` — locale, currency, and money constants
- `packages/tsconfig` and `packages/eslint-config` — shared tooling

## Backend

Modular NestJS. HTTP, application, persistence, and infrastructure stay in separate layers.

```
src/
  main.ts
  app.module.ts
  config/
  common/
  database/
  redis/
  modules/
  health/
```

Feature modules:

- `auth` — register, login, JWT access token
- `users` — persistence for the account owner
- `profile` — name and password
- `preferences` — theme, hidden balances, currency, `periodStartDay`, notification flags
- `accounts` — checking and cash accounts
- `categories` — income and expense categories, including the defaults created at registration
- `transactions` — income, expense, and transfer
- `installments` — installment plans on a transaction
- `credit-cards` — cards and invoices
- `budgets` — planned amounts for the financial month
- `subscriptions` — recurring charges
- `dashboard` — month totals for the signed-in user
- `assistant` — calculated insights for the open financial month (fixed prompts, not a language model)

A module is shaped like this:

```
module/
  controllers/
  services/
  repositories/
  dto/
  entities/
  interfaces/
  module.ts
```

Do not put business rules in controllers. Persist through repositories, not Prisma calls from services when the module grows.

## Data isolation

A user owns their data. Every financial entity has a clear owner (`user_id`). The API must never return another user's records. A missing row and a row owned by someone else both surface as not found.

```
User A → Financial Data A
User B → Financial Data B
```

This is not multi-tenant B2B. Household / shared accounts may appear later; do not encode that model now, and do not block it.

Table layout, enums, and foreign keys: `docs/database.md`.

## Auth

JWT access tokens. Password hashes with Argon2. Soft-deleted users cannot authenticate.

## Money and time

Amounts use `DECIMAL(19, 4)`. The financial month follows `periodStartDay` in the user's timezone, while timestamps stay in UTC. See `docs/money-and-dates.md` and `docs/billing-cycle.md`.

## Mobile

```
UI → Hooks → State / Query → API Client → Backend
```

Zustand holds session. TanStack Query holds server state (dashboard, profile, preferences, categories). The JWT lives in `expo-secure-store`, not AsyncStorage.

Product UI tokens and components: `docs/design-system.md`. Login/register still use the legacy theme in `apps/mobile/src/constants/theme.ts`.

## Redis and rate limiting

Redis is connected at startup and reported by `GET /health`. HTTP rate limiting is enabled with `@nestjs/throttler` (60 requests per minute, stored in the API process).

Cache, sessions, background jobs, locks, and a shared rate-limit store in Redis are not implemented yet.

## Observability

Structured logs (Pino), request IDs, and `/health`. Metrics, tracing, and error tracking come later.
