# To-Do Workshop

A TypeScript monorepo foundation for a specification-driven To-Do application. This repository establishes the frontend, API, shared contracts, database, test, and container boundaries; it intentionally does not implement task-management workflows.

## Requirements

- Node.js 24.11 or newer (Node.js 26 LTS is the project and CI target)
- Corepack with pnpm 12.21.0
- Docker Engine with Docker Compose v2 for the container stack

## Local setup

```sh
corepack pnpm install
corepack pnpm db:generate
corepack pnpm dev
```

First create the ignored root `.env` using the local setup in [development](docs/development.md#environment).

The web app is served at `http://localhost:5173`; the API listens at `http://localhost:3000`. The API liveness endpoint is `/api/v1/health`, and database readiness is reported at `/api/v1/health/ready`.

To provision PostgreSQL locally, start the Compose database and then apply the checked-in migration:

```sh
docker compose up -d db
corepack pnpm db:migrate
corepack pnpm db:seed
```

Use local-only credentials for development and managed secrets for shared or production environments.

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

The GitHub Actions workflow maps `develop` to staging environment validation and `main` to production environment validation. CI never deploys the application or connects to real staging/production systems. Tests use isolated CI services, including a disposable PostgreSQL database for migration validation.

For pushes and manual runs on `develop` or `main`, a job validates the corresponding GitHub Environment settings without starting services. Same-repository pull requests targeting `develop` validate `staging` too. Fork pull requests and pull requests targeting `main` do not access environment secrets. The job fails if the environment is not configured. See [development](docs/development.md#github-environments) for setup.

The workflow also runs lint/typecheck and unit/integration tests, Semgrep and Gitleaks, and browser/API Playwright suites. It uploads generated Allure HTML as a downloadable `allure-report` artifact; it does not deploy reports to GitHub Pages. Permissions are read-only and no repository secrets are used for fork pull requests.

The PR template suggests existing repository labels and provides an assignee field. Apply labels and assignees in GitHub's PR sidebar; templates can populate the description but cannot set those metadata fields.

## Docker

Use one cross-platform TypeScript command for Docker environments on Windows and Ubuntu. Create the appropriate ignored `.env`, `.env.test`, `.env.staging`, or `.env.production` file first:

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

`start` waits for service health checks; `rebuild` rebuilds and starts the stack; `stop` removes containers without deleting the database volume. `migrate` runs Prisma `migrate deploy` against the selected database and is safe to use in staging and production. Schema migrations are never run automatically on application startup. `test` runs the Docker API test profile and is restricted to the test environment. `config` validates Compose settings without starting services.

Supply staging and production values through an ignored local env file or a deployment secret manager; never commit `.env` or `.env.*` files. Production deployment still requires an appropriate secret manager, TLS/ingress, backup/restore procedures, and environment-specific operational review.

## Workspace

| Package           | Responsibility                                                         |
| ----------------- | ---------------------------------------------------------------------- |
| `apps/web`        | React/TypeScript browser shell, routing, UI states, and API client     |
| `apps/api`        | Express/TypeScript API boundary, health checks, middleware, and Prisma |
| `packages/shared` | Typed Zod contracts and package exports                                |
| `tests/e2e`       | Playwright browser and API smoke tests                                 |

See [development](docs/development.md), [architecture](docs/architecture.md), [API conventions](docs/api.md), [testing](docs/testing.md), and [ADR 0001](docs/adr/0001-typescript-monorepo.md) for details.
