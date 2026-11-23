# Testing

## Layers

- **Unit:** Jest and React Testing Library cover the web shell and accessible UI states. API unit tests exercise request validation without a database.
- **Integration:** Supertest verifies API health/readiness/error behavior against the Express application without opening a port.
- **End-to-end:** Playwright checks the rendered browser shell and API liveness. Browser specs use page objects and named steps; API specs use typed API clients, fixtures, and response factories. The browser test intentionally does not assert task workflows.
- **Database:** Prisma migrations and optional seed are explicit; database-backed behavior should use an isolated test database from `.env.test.example`.

## Playwright organization and reporting

`tests/e2e/specs/browser` and `tests/e2e/specs/api` contain only test scenarios. Reusable pages, API clients, fixtures, steps, factories, types, URL constants, response parsing helpers, and the route-mocking fixture live under `tests/e2e/src`. API smoke tests intentionally call the real API. The current shell has no API dependency, so browser scenarios do not install unused mocks. For isolated app integration tests, mock outbound dependencies through injected services (as the health module does for its database check); do not mock the endpoint under test.

The Playwright config writes Allure result files to `tests/e2e/allure-results`. Generate and open the HTML report after running tests:

```sh
corepack pnpm allure:report
corepack pnpm allure:open
```

The Allure CLI requires a supported Java runtime in addition to Node.js. Install Chromium for browser tests when necessary:

```sh
corepack pnpm --filter @todo/e2e exec playwright install chromium
```

GitHub Actions runs the same workspace commands, applies migrations to an isolated PostgreSQL service, performs Semgrep and Gitleaks scans, and uploads the generated HTML report as the `allure-report` workflow artifact. The hosted workflow is intentionally read-only and does not use custom secrets on fork pull requests.

## Commands

```sh
corepack pnpm lint
corepack pnpm format:check
corepack pnpm typecheck
corepack pnpm test:unit
corepack pnpm test:integration
corepack pnpm test:api
corepack pnpm test:e2e
corepack pnpm test:e2e:all
```

Integration and smoke tests inject or use process health paths and do not require a live database. For future database tests, set `DATABASE_URL` to a separate disposable PostgreSQL database; never point tests at a developer or production database.
