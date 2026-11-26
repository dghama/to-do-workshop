# Implementation Plan: Create a Task

**Branch**: `feature/scrum-16-create-task` | **Date**: 2026-11-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/scrum-16-create-task/spec.md`

## Summary

Implement SCRUM-16 as a new task creation flow across the existing React web app and Express API. The API validates and creates incomplete tasks, while the web form presents loading, disabled, success, validation, and save-error states. The design uses existing workspace boundaries, shared Zod contracts, Prisma/PostgreSQL storage, and Jest/Playwright verification. It adds only the fields required for task creation and preserves schedule values independently.

## Technical Context

**Language/Version**: TypeScript 5 with Node.js >=24.11.0

**Primary Dependencies**: React, React Router, Express, Zod, Prisma 7, PostgreSQL, Jest, React Testing Library, Playwright

**Storage**: PostgreSQL through the existing Prisma 7 adapter and migration workflow

**Testing**: Jest/React Testing Library for unit tests, Supertest for API integration tests, Playwright for end-to-end browser/API checks

**Target Platform**: Browser UI and Node.js HTTP API

**Project Type**: pnpm web application plus API modular monolith

**Performance Goals**: No numeric target is specified in SCRUM-16; preserve normal interactive form behavior and existing API middleware limits.

**Constraints**: WCAG 2.2 Level AA, API body limit 1 MiB, local-date scheduling, no overnight task intervals, and existing `/api/v1` envelopes.

**Scale/Scope**: One task creation journey, one public create contract, one persistence migration, and cohesive web/API task modules.

## Constitution Check

*GATE: Passes before Phase 0 research, subject to the migration and contract checks below.*

- **I. Modular Monolith**: PASS. `apps/web` will own the form and browser behavior; `apps/api` will own the HTTP create route and persistence service; `packages/shared` will own shared create contracts.
- **II. Cohesive Modules and Stable Contracts**: PASS. New `tasks` feature modules and explicit Zod schemas follow existing module boundaries.
- **III. Secure Data and Reliable Operations**: PASS. Input validation occurs at the API boundary, error responses remain in the existing safe envelope, and creation will use a reviewed Prisma migration.
- **IV. Accessible Experience**: PASS. The form and status feedback require semantic labels, keyboard support, visible focus, associated field errors, and accessible announcements.
- **V. Verifiable Quality**: PASS. Unit, integration, contract, end-to-end, accessibility, lint, typecheck, migration, and secret-scan gates are available.

## Project Structure

### Documentation (this feature)

```text
specs/scrum-16-create-task/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── create-task.openapi.yaml
└── spec.md
```

### Source Code (repository root)

```text
apps/api/src/modules/tasks/
├── tasks.constants.ts
├── tasks.routes.ts
├── tasks.service.ts
├── tasks.types.ts
└── __tests__/
apps/web/src/modules/tasks/
├── components/
├── pages/
├── services/
├── tasks.constants.ts
└── __tests__/
packages/shared/src/modules/tasks/
├── task.schemas.ts
├── task.types.ts
└── index.ts
apps/api/prisma/migrations/
└── <timestamp>_create_task_fields/
    └── migration.sql
tests/e2e/specs/browser/
└── create-task.spec.ts
tests/e2e/specs/api/
└── create-task.api.spec.ts
```

**Structure Decision**: Use the repository's existing modular monolith layout. The web task module owns the creation journey; the API task module owns HTTP concerns and delegates persistence; the shared task module owns request/response contracts. No new package or infrastructure layer is needed.

## Complexity Tracking

No Constitution violations require an exception or complexity justification.

## Repository Alignment and Verification Strategy

### Repository Evidence

- `apps/web/src/app/routes.tsx` demonstrates route composition and module entry points.
- `apps/web/src/modules/home/` demonstrates cohesive feature-module organization.
- `apps/web/src/services/api-client.ts` provides typed fetch, success/error parsing, and existing Zod contract handling.
- `apps/web/src/components/ui/LoadingState.tsx` and `ErrorState.tsx` provide existing loading and error patterns.
- `apps/api/src/app.ts` mounts versioned routers under `/api/v1` and installs validation, security, rate-limit, and error middleware.
- `apps/api/src/modules/health/` demonstrates route/service/type separation.
- `apps/api/src/middleware/validate-body.ts` supplies structured Zod body validation.
- `apps/api/prisma/schema.prisma` already defines the initial Task table.
- `packages/shared/src/modules/health/` demonstrates module contracts and exports.
- `docs/testing.md` and `docs/api.md` document test layers and API conventions.
- `.specify/memory/constitution.md` requires module boundaries, accessible journeys, migrations, isolated tests, and repository quality gates.
- Quality commands available in `package.json`: `corepack pnpm lint`, `format:check`, `typecheck`, `test:unit`, `test:integration`, `test:e2e`, `test:api`, and `test:e2e:all`.

### Architecture and Verification Impact

The smallest design adds task fields to the existing Prisma Task model and exposes `POST /api/v1/tasks`. Shared Zod contracts define create input and response data. The API route validates input, creates the task, and returns the existing `{ data }` envelope; failures use the existing `{ error }` envelope and request correlation behavior. The web form calls the create service, shows loading and disables repeated submission, associates validation errors with controls, announces outcome feedback, and routes success to the existing shell.

- **FR-001/FR-006/FR-008/FR-009/BR-001**: Zod and focused unit/integration tests prove whitespace title rejection and accessible field errors.
- **FR-002/FR-003/FR-004/FR-007/BR-002/BR-003/BR-004**: Shared contract tests and API integration tests prove optional fields and same-local-date time validation.
- **FR-010/BR-005**: Persistence and integration tests prove the task is created incomplete.
- **FR-011/FR-012/FR-013**: API integration and browser end-to-end tests prove correct placement and success/failure outcomes.
- **FR-014/FR-015/SC-005**: React Testing Library and Playwright prove loading/disabled behavior and keyboard/assistive-technology feedback; automated accessibility checks and manual keyboard review cover WCAG 2.2 AA.
- **SC-002/SC-003/SC-004**: Unit and integration assertions provide 100% coverage of specified validation and save-failure cases in the test suite.

Migration verification will use the repository's isolated PostgreSQL workflow. Browser/API smoke tests will use the documented Playwright commands. CI/CD configuration remains unchanged; existing lint, typecheck, test, migration, and security gates apply to the feature.

## Feature Impact Assessment

| Area | Classification | Repository evidence and affected requirements | Validation |
| --- | --- | --- | --- |
| Database | New | Existing `Task` model in `apps/api/prisma/schema.prisma` gains description and schedule fields for FR-002/FR-003/FR-004/BR-002/BR-003/BR-005. | Add and migrate a reviewed Prisma migration; test against isolated PostgreSQL. |
| Backend / API | New | No task API module exists; `apps/api/src/app.ts` provides `/api/v1` mounting and shared validation/error patterns. FR-001 through FR-013 apply. | Unit and Supertest integration tests for validation, persistence, success, and failure. |
| Frontend / UI | New | No task workflow exists; existing React modules and UI state components are reusable for FR-009/FR-011 through FR-015. | React Testing Library unit tests, Playwright journey, automated axe-style checks, and manual keyboard/screen-reader review. |
| CI/CD | Existing functionality | Existing `.github/workflows` quality gates already cover lint, typecheck, tests, migrations, Semgrep, and Gitleaks. | Run applicable documented commands and inspect CI mapping; no new pipeline layer. |
| Unit testing | New | `apps/web/src/**/*.test.tsx` and `apps/api/src/**/*.test.ts` patterns are established; validation and UI state need focused coverage. | Jest/React Testing Library and API unit tests. |
| E2E testing | New | `tests/e2e/specs/browser` and `tests/e2e/specs/api` establish Playwright organization. | Browser and API Playwright scenarios for success, validation, and save failure. |
