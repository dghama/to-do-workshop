# To-Do Workshop

A TypeScript monorepo foundation for a specification-driven To-Do application. This repository establishes the frontend, API, shared contracts, database, test, and container boundaries; it intentionally does not implement task-management workflows.

## Requirements

- Node.js 24.11 or newer (Node.js 26 LTS is the project and CI target)
- Corepack with pnpm 12.21.0
- Docker Engine with Docker Compose v2 for the container stack

## Local setup

```sh
corepack pnpm install
node -e "require('node:fs').copyFileSync('.env.example', '.env')"
corepack pnpm db:generate
corepack pnpm dev
```

The web app is served at `http://localhost:5173`; the API listens at `http://localhost:3000`. The API liveness endpoint is `/api/v1/health`, and database readiness is reported at `/api/v1/health/ready`.

To provision PostgreSQL locally, start the Compose database and then apply the checked-in migration:

```sh
docker compose up -d db
corepack pnpm db:migrate
corepack pnpm db:seed
```

The example `.env` credentials are for local development only. Replace them with managed secrets before using any shared or production environment.

## Quality and tests

```sh
corepack pnpm lint
corepack pnpm format:check
corepack pnpm typecheck
corepack pnpm test:unit
corepack pnpm test:integration
corepack pnpm test:e2e
corepack pnpm test:e2e:all
corepack pnpm allure:report
corepack pnpm allure:open
```

Playwright browser tests require a Chromium installation. Install it with `corepack pnpm --filter @todo/e2e exec playwright install chromium` if it is not already available. `corepack pnpm test:api` runs the API smoke test through Playwright.

## CI and pull requests

The GitHub Actions workflow maps `develop` to staging-oriented environment validation and `main` to production-oriented environment validation. Other branches use the test example; pull requests use their target branch for this mapping. This only validates checked-in sample configuration: CI never deploys the application or connects to real staging/production systems. Tests use local or isolated CI services, including a disposable PostgreSQL database for migration validation.

For pushes and manual runs on `develop` or `main`, an additional job reads CI-only variables from the `staging` or `production` GitHub Environment, respectively. Pull requests never run this job or access environment secrets. See [development](docs/development.md#github-environments) for setup.

The workflow also runs lint/typecheck and unit/integration tests, Semgrep and Gitleaks, and browser/API Playwright suites. It uploads generated Allure HTML as a downloadable `allure-report` artifact; it does not deploy reports to GitHub Pages. Permissions are read-only and no repository secrets are used for fork pull requests.

The PR template suggests existing repository labels and provides an assignee field. Apply labels and assignees in GitHub's PR sidebar; templates can populate the description but cannot set those metadata fields.

## Docker

Use one cross-platform TypeScript command for Docker environments on Windows and Ubuntu. Copy the appropriate `.env.*.example` file to `.env`, `.env.test`, `.env.staging`, or `.env.production` first:

```sh
corepack pnpm run env -- dev start
corepack pnpm run env -- dev rebuild
corepack pnpm run env -- dev stop
corepack pnpm run env -- dev migrate

corepack pnpm run env -- test start
corepack pnpm run env -- test test

corepack pnpm run env -- staging start
corepack pnpm run env -- staging rebuild
corepack pnpm run env -- staging migrate
corepack pnpm run env -- staging stop

corepack pnpm run env -- prod start
corepack pnpm run env -- prod rebuild
corepack pnpm run env -- prod migrate
corepack pnpm run env -- prod stop
```

`start` waits for service health checks; `rebuild` rebuilds and starts the stack; `stop` removes containers without deleting the database volume. `migrate` runs Prisma `migrate deploy` against the selected database and is safe to use in staging and production. Schema migrations are never run automatically on application startup. `test` runs the Docker API test profile and is restricted to the test environment. `config` validates Compose settings without starting services and may use the checked-in example file when the local environment file is absent.

Staging and production examples deliberately contain placeholder credentials. Supply real values through a local ignored env file or a deployment secret manager; never commit populated `.env.*` files. Production deployment still requires an appropriate secret manager, TLS/ingress, backup/restore procedures, and environment-specific operational review.

## Workspace

| Package           | Responsibility                                                         |
| ----------------- | ---------------------------------------------------------------------- |
| `apps/web`        | React/TypeScript browser shell, routing, UI states, and API client     |
| `apps/api`        | Express/TypeScript API boundary, health checks, middleware, and Prisma |
| `packages/shared` | Typed Zod contracts and package exports                                |
| `tests/e2e`       | Playwright browser and API smoke tests                                 |

See [development](docs/development.md), [architecture](docs/architecture.md), [API conventions](docs/api.md), [testing](docs/testing.md), and [ADR 0001](docs/adr/0001-typescript-monorepo.md) for details.
