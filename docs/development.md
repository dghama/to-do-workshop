# Development

## Environment

Copy `.env.example` to `.env` at the repository root. The API and Prisma configuration load that file explicitly; process-level environment variables take precedence. `VITE_API_BASE_URL` is the only browser-exposed environment value.

The API can start without PostgreSQL so that liveness and API smoke checks remain usable. Readiness reports 503 until the configured database is reachable. To initialize the local database, start the `db` Compose service and run `pnpm db:migrate`; seeding is optional.

## Docker environments

`scripts/environment.ts` provides one Node/TypeScript entry point for Windows and Ubuntu. Create the local environment files from the examples (`.env` for development; `.env.test`, `.env.staging`, and `.env.production` for the other environments), then use:

```sh
corepack pnpm run env -- <dev|test|staging|prod> <start|rebuild|stop|migrate|test|config>
```

`start` waits for health checks. The database health check authenticates with the configured credentials and executes `SELECT 1` before the API starts. If credentials change after a database volume has been initialized, update the local URL and database role consistently; changing the environment file does not reinitialize or reset existing data. `rebuild` builds the service images and starts them. `stop` runs Compose `down` but deliberately preserves database volumes. `migrate` runs Prisma `migrate deploy`; migrations are explicit, not applied at startup. `test` runs the Docker API test profile and is only allowed in the test environment. `config` validates the selected Compose setup and uses the matching example file if no local env file exists. Compose project names and database volumes are isolated per environment. There is one root `docker-compose.yml`; environment selection uses env files rather than duplicated Compose files.

Never put staging/production secrets in source control. The checked-in staging and production environment files are placeholders only; populate ignored local files or inject secret-manager values in deployments. The current CI only validates sample configuration and uses isolated, non-secret test defaults, so it requires no staging/production secrets. If deployment is added later, use protected GitHub Environments with environment-scoped secrets rather than exposing production values to pull-request jobs. No environment action removes volumes or performs a schema reset.

The sample environments use distinct host ports so dev, test, staging, and production Compose projects can run alongside one another. If you change a host port, keep it unique across other projects on the machine; Compose service-to-service URLs should continue to use the service name and container port (for example, `db:5432`), not the host-published port.

## GitHub Environments

In the GitHub repository, open **Settings > Environments**, create `staging` and `production`, and configure deployment-branch restrictions and any required reviewers for your organization. For each environment, under **Environment variables**, optionally add these CI-only variables:

| Variable          | Default                        | Allowed values                                               |
| ----------------- | ------------------------------ | ------------------------------------------------------------ |
| `CI_LOG_LEVEL`    | `info`                         | `fatal`, `error`, `warn`, `info`, `debug`, `trace`, `silent` |
| `CI_WEB_ORIGIN`   | `http://localhost:5175`        | Localhost or `127.0.0.1` HTTP URL only                       |
| `CI_API_BASE_URL` | `http://localhost:3001/api/v1` | Localhost or `127.0.0.1` HTTP URL only                       |

On pushes and manual runs, `develop` uses `staging` and `main` uses `production`. The environment-scoped job reads these variables to validate Compose configuration; it does not start services or deploy. Pull requests, including forks, do not access either environment. Migration tests always use a disposable CI database. No sensitive environment secret is required by these checks. If deployment is later implemented, store real credentials under **Environment secrets**, and reference them only from trusted, protected deployment jobs; do not put them in environment variables or PR jobs.

Git ignores real `.env` and `.env.*` files, while the four sanitized root `.example` templates are intentionally tracked. To stop tracking a real environment file that was previously committed without deleting the local copy, run `git rm --cached -- path/to/.env`, then commit the removal. This does not erase Git history: rotate any credentials that were ever committed or shared, and follow your organization's incident process.

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
