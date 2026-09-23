# Tonti

[Português](README.pt-BR.md)

[![CI](https://github.com/victor-dias-dev/TONTI/actions/workflows/ci.yml/badge.svg)](https://github.com/victor-dias-dev/TONTI/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Brazilian personal finance for one person: exact money, a billing cycle that is not always the calendar month, and records that belong to a single user.

Amounts are `DECIMAL(19, 4)`. Timestamps are UTC. The API never returns another user's accounts, transactions, or budgets. The assistant is a calculated reading of the current financial month, not a language model.

![Categories](docs/screenshots/categories.png)
![Profile](docs/screenshots/profile.png)
![Preferences](docs/screenshots/preferences.png)

## What is in the app

- Auth, profile, and preferences (theme, hidden balances, currency, billing-cycle start)
- Accounts, categories, transactions, and installments
- Credit cards, budgets, and subscriptions
- Dashboard
- Assistant insights for the open financial month

## Requirements

- Node.js 22+
- pnpm 9+
- Docker and Docker Compose

## Quick start

```bash
pnpm install
docker compose up -d
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
pnpm db:generate
pnpm db:migrate:deploy
pnpm db:seed
pnpm dev
```

The seed user is `demo@tonti.app` / `Demo1234!`.

`pnpm dev` starts the NestJS API and the Expo Metro bundler. Separately: `pnpm dev:api` and `pnpm dev:mobile`.

API prefix: `/api/v1`. Health: `GET /health`. Swagger in development: http://localhost:3000/api/docs

The API refuses to boot when a required variable is missing. Copy the examples and keep real secrets out of git.

| Variable         | Purpose                                |
| ---------------- | -------------------------------------- |
| `NODE_ENV`       | `development`, `test`, or `production` |
| `PORT`           | HTTP port                              |
| `DATABASE_URL`   | PostgreSQL                             |
| `REDIS_URL`      | Redis                                  |
| `JWT_SECRET`     | JWT secret, at least 32 characters     |
| `JWT_EXPIRES_IN` | Access token lifetime (`7d`, `1h`)     |
| `CORS_ORIGIN`    | Allowed origins (`*` in development)   |

On mobile, set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env` when the API is not on `http://localhost:3000/api/v1`.

## Checks

```bash
pnpm test
pnpm test:e2e
pnpm lint
pnpm typecheck
pnpm build
```

End-to-end tests need PostgreSQL, Redis, and the `tonti_test` database.

## Repository

```text
apps/api          NestJS REST API
apps/mobile       Expo / React Native
packages/types    Shared TypeScript contracts
packages/config   Locale, currency, and money constants
packages/tsconfig
packages/eslint-config
```

Money and time rules: [docs/money-and-dates.md](docs/money-and-dates.md). Billing cycle: [docs/billing-cycle.md](docs/billing-cycle.md). Modules and boundaries: [docs/architecture.md](docs/architecture.md). Schema: [docs/database.md](docs/database.md). Mobile UI: [docs/design-system.md](docs/design-system.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security reports go through [private vulnerability reporting](https://github.com/victor-dias-dev/TONTI/security/advisories/new), described in [SECURITY.md](SECURITY.md).

Licensed under the [MIT License](LICENSE).
