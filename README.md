# Tonti

Aplicativo brasileiro de gestão financeira pessoal. Esta etapa contém apenas a foundation: monorepo, API NestJS, autenticação, mobile Expo e infraestrutura local.

## Requirements

- Node.js 22+
- pnpm 9+
- Docker
- Docker Compose

## Installation

```bash
pnpm install
```

Suba PostgreSQL e Redis:

```bash
docker compose up -d
```

Gere o client do Prisma e aplique as migrations:

```bash
pnpm db:generate
pnpm db:migrate:deploy
```

Opcional — usuário de desenvolvimento (`demo@tonti.app` / `Demo1234!`):

```bash
pnpm db:seed
```

## Environment

Copie `apps/api/.env.example` para `apps/api/.env`. Variáveis obrigatórias:

| Variável         | Descrição                                   |
| ---------------- | ------------------------------------------- |
| `NODE_ENV`       | `development`, `test` ou `production`       |
| `PORT`           | Porta HTTP da API                           |
| `DATABASE_URL`   | Conexão PostgreSQL                          |
| `REDIS_URL`      | Conexão Redis                               |
| `JWT_SECRET`     | Segredo JWT (mínimo 32 caracteres)          |
| `JWT_EXPIRES_IN` | Expiração do token (`7d`, `1h`, ...)        |
| `CORS_ORIGIN`    | Origens permitidas (`*` em desenvolvimento) |

A API valida essas variáveis na inicialização e recusa subir se alguma obrigatória estiver ausente.

No mobile, copie `apps/mobile/.env.example` para `apps/mobile/.env` e ajuste `EXPO_PUBLIC_API_URL` se necessário.

## Database

Prisma vive em `apps/api/prisma`.

- Schema: `apps/api/prisma/schema.prisma`
- Migrations: `apps/api/prisma/migrations`
- Seed: `apps/api/prisma/seed.ts`

Comandos:

```bash
pnpm db:migrate          # cria/aplica migration em desenvolvimento
pnpm db:migrate:deploy    # aplica migrations existentes
pnpm db:studio            # Prisma Studio
```

IDs são UUID. Timestamps são UTC (`TIMESTAMPTZ`). Valores financeiros usam `DECIMAL(19, 4)` — ver `docs/money-and-dates.md`. Tabelas e relacionamentos: `docs/database.md`.

## Development

```bash
pnpm dev
```

Isso sobe a API (NestJS watch) e o Metro do Expo.

Separado:

```bash
pnpm dev:api
pnpm dev:mobile
```

## Testing

```bash
pnpm test
pnpm test:e2e
pnpm lint
pnpm typecheck
pnpm build
```

Os testes e2e da API exigem PostgreSQL e Redis (via `docker compose up -d`) e o banco `tonti_test`.

## Architecture

Monorepo Turborepo + pnpm:

```text
apps/api          NestJS REST API (`/api/v1`)
apps/mobile       Expo / React Native
packages/types    Contratos TypeScript compartilhados
packages/config   Locale, moeda e constantes monetárias
packages/tsconfig TypeScript compartilhado
packages/eslint-config
```

Detalhes em `docs/architecture.md`. Isolamento de dados: todo dado financeiro pertence a um usuário e nunca pode ser acessado por outro. Schema das tabelas: `docs/database.md`. Design system do mobile: `docs/design-system.md`.

Mobile:

```text
UI → Hooks → State / Query → API Client → Backend
```

Zustand guarda sessão. TanStack Query guarda estado do servidor. JWT fica no `expo-secure-store`.

## API

- Prefixo: `/api/v1`
- Health: `GET /health`
- Swagger (desenvolvimento): [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

Auth:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```
