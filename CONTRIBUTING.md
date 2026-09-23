# Contributing

Issues and pull requests in Portuguese or English are both welcome.

## Setup

Requirements: Node.js 22+, pnpm 9+, Docker.

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

The seed user is `demo@tonti.app` / `Demo1234!`. API docs in development: http://localhost:3000/api/docs

Do not commit `.env` files or real secrets.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

End-to-end tests need PostgreSQL and Redis from `docker compose`, including the `tonti_test` database created by `infrastructure/docker/postgres/init.sql`.

## Pull requests

Open a focused change with a short explanation of why it exists. Financial behavior needs a test: money stays exact, and one user never reads another user's records.

See [docs/architecture.md](docs/architecture.md), [docs/money-and-dates.md](docs/money-and-dates.md), and [docs/billing-cycle.md](docs/billing-cycle.md).
