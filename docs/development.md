# Development

## Environment

Create `.env` at the repository root, using your own local-only password consistently in the following template. The API and Prisma configuration load that file explicitly; process-level environment variables take precedence. `VITE_API_BASE_URL` is the only browser-exposed environment value.

```dotenv
NODE_ENV=development
API_PORT=3000
WEB_PORT=5173
POSTGRES_PORT=5432
POSTGRES_DB=todo_dev
POSTGRES_USER=todo
POSTGRES_PASSWORD=replace-with-local-password
LOG_LEVEL=info
WEB_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://todo:replace-with-local-password@localhost:5432/todo_dev?schema=public
DATABASE_URL_DOCKER=postgresql://todo:replace-with-local-password@db:5432/todo_dev?schema=public
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

URL-encode special characters in the password in both database URLs. These placeholders are not production credentials.

The API can start without PostgreSQL so that liveness and API smoke checks remain usable. Readiness reports 503 until the configured database is reachable. To initialize the local database, start the `db` Compose service and run `pnpm db:migrate`; seeding is optional.

## Docker environments

`scripts/environment.ts` provides one Node/TypeScript entry point for Windows and Ubuntu. Create local environment files (`.env` for development; `.env.test`, `.env.staging`, and `.env.production` for the other environments), then use:

```sh
corepack pnpm run env -- <dev|test|staging|prod> <start|rebuild|stop|migrate|test|config>
```

`start` waits for health checks. The database health check authenticates with the configured credentials and executes `SELECT 1` before the API starts. If credentials change after a database volume has been initialized, update the local URL and database role consistently; changing the environment file does not reinitialize or reset existing data. `rebuild` builds the service images and starts them. `stop` runs Compose `down` but deliberately preserves database volumes. `migrate` runs Prisma `migrate deploy`; migrations are explicit, not applied at startup. `test` runs the Docker API test profile and is only allowed in the test environment. `config` validates the selected Compose setup. Compose project names and database volumes are isolated per environment. There is one root `docker-compose.yml`; environment selection uses env files rather than duplicated Compose files.

Never put staging/production secrets in source control. Populate ignored local files or inject secret-manager values in deployments. CI validates staging settings without connecting to those services; all tests use isolated CI databases. If deployment is added later, use protected GitHub Environments with environment-scoped secrets rather than exposing production values to pull-request jobs. No environment action removes volumes or performs a schema reset.

Choose distinct host ports if dev, test, staging, and production Compose projects need to run alongside one another. Compose service-to-service URLs should use the service name and container port (for example, `db:5432`), not the host-published port.

## GitHub Environments

In **Settings > Environments**, configure `staging` and `production`, including deployment-branch restrictions and any required reviewers. In `staging`, set environment variables `NODE_ENV`, `API_PORT`, `WEB_PORT`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `LOG_LEVEL`, `WEB_ORIGIN`, and `VITE_API_BASE_URL`. Set environment secrets `POSTGRES_PASSWORD`, `DATABASE_URL`, and `DATABASE_URL_DOCKER`; do not enter their values in chat.

On pushes and manual runs, `develop` validates the staging settings with Compose, without printing resolved configuration or starting services. `DATABASE_URL` is checked for PostgreSQL URL syntax only; Compose uses `DATABASE_URL_DOCKER`. Localhost and `db` hostnames are local examples, not evidence that a staging service is reachable. The `main` job selects `production` but deliberately validates isolated CI defaults, not production credentials. Pull requests, including forks, do not access either environment. Migration tests always use a disposable CI database. No job deploys the application.

Git ignores `.env` and `.env.*` files recursively. To stop tracking an environment file that was previously committed without deleting the local copy, run `git rm --cached -- path/to/.env`, then commit the removal. This does not erase Git history: rotate any credentials that were ever committed or shared, and follow your organization's incident process. Git ignore does not prevent an explicit forced add.

## TypeScript conventions

- Keep application, test, shared package, Prisma config/seed, and runnable source in `.ts` or `.tsx`.
- Use the strict root `tsconfig.base.json`; browser code uses Vite bundler resolution and Node packages use NodeNext.
- Keep runtime package exports explicit and generated shared declarations in `packages/shared/dist`.
- ESLint and Prettier configs use their native configuration formats; they do not make application source JavaScript.
- Run `pnpm typecheck` independently from Jest. Jest uses Babel to transpile TypeScript and does not replace type checking.

## Commit hook

The root `simple-git-hooks` pre-commit hook runs `corepack pnpm lint`. It is installed during `corepack pnpm install` on Ubuntu and Windows (with Git for Windows available). Reinstall it after changing hook configuration with `corepack pnpm exec simple-git-hooks`.

## Useful commands

| Command            | Purpose                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `pnpm dev`         | Build shared exports, then start web and API development servers |
| `pnpm build`       | Build workspace packages in dependency order                     |
| `pnpm typecheck`   | Typecheck API, shared, web, and Playwright projects              |
| `pnpm db:generate` | Generate the Prisma client                                       |
| `pnpm db:migrate`  | Apply committed migrations                                       |
| `pnpm db:seed`     | Insert the stable sample Task row                                |
| `pnpm docker:up`   | Build and start the Compose stack                                |
