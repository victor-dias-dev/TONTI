# Architecture

Tonti is a personal finance app for individuals in Brazil. This document covers only the foundation: what exists today and the constraints future modules must follow.

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

Future feature modules should follow:

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

A user owns their data. Every future financial entity must have a clear owner (`userId` or equivalent). The API must never return another user's records.

```
User A → Financial Data A
User B → Financial Data B
```

This is not multi-tenant B2B. Household / shared accounts may appear later; do not encode that model now, and do not block it.

## Auth

JWT access tokens. Password hashes with Argon2. Soft-deleted users cannot authenticate.

## Mobile

```
UI → Hooks → State / Query → API Client → Backend
```

Zustand holds session and local preferences. TanStack Query holds server state. The JWT lives in `expo-secure-store`, not AsyncStorage.

## Redis

The connection is ready for cache, rate limiting, sessions, jobs, and locks. Those uses are not implemented yet.

## Observability

Structured logs (Pino), request IDs, and `/health`. Metrics, tracing, and error tracking come later.
