# Tasks: Create a Task

**Input**: Design documents from `/specs/scrum-16-create-task/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Verification is required for behavior, contract, data, API, UI, accessibility, and migration changes.

**Organization**: Tasks are grouped by the P1 user story so SCRUM-16 can be implemented and validated as one independently deliverable increment.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish feature module locations and shared development context

- [ ] T001 Create the task module directories and public export points in `apps/api/src/modules/tasks/`, `apps/web/src/modules/tasks/`, and `packages/shared/src/modules/tasks/`
- [ ] T002 Add feature route placeholder and navigation entry from `apps/web/src/app/routes.tsx` to the task creation page
- [ ] T003 Inspect existing task migration and shared export conventions in `apps/api/prisma/schema.prisma`, `apps/api/prisma/migrations/20261120120000_init/migration.sql`, and `packages/shared/src/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared contracts and persistence prerequisites that block all story work

**CRITICAL**: No user story implementation can begin until these contracts and migration foundations are complete.

- [ ] T004 Extend `Task` in `apps/api/prisma/schema.prisma` with fields: `title` required and nonblank, `description` optional text, `scheduledDate` optional local ISO date, `startTime` optional local wall-clock time, `endTime` optional local wall-clock time, and `completed` default `false`
- [ ] T005 Create the reviewed Prisma migration in `apps/api/prisma/migrations/<timestamp>_create_task_fields/migration.sql` preserving existing task rows and adding optional task fields
- [ ] T006 [P] Create shared create request/response schemas in `packages/shared/src/modules/tasks/task.schemas.ts` for `title`, optional `description`, optional `scheduledDate`, optional `startTime`, optional `endTime`, and task response fields
- [ ] T007 [P] Export task types and schemas from `packages/shared/src/modules/tasks/task.types.ts`, `packages/shared/src/modules/tasks/index.ts`, and `packages/shared/src/index.ts`
- [ ] T008 [P] Add shared contract unit tests for create input and response parsing in `packages/shared/src/modules/tasks/task.schemas.test.ts`
- [ ] T009 Run `corepack pnpm --filter @todo/shared build && corepack pnpm typecheck` to verify shared contracts compile after the foundation changes

**Checkpoint**: Shared task contract and persistence foundation ready

---

## Phase 3: User Story 1 - Create a Scheduled or Unscheduled Task (Priority: P1) MVP

**Goal**: Allow a planner to create a valid incomplete task with optional description and local scheduling, or an unscheduled task.

**Independent Test**: Submit valid dated and unscheduled tasks, blank-title and invalid-time submissions, and a save failure through the API and browser journey; verify the observable success, validation, loading, disabled, and error outcomes required by FR-001 through FR-015 and SC-001 through SC-005.

### Tests for User Story 1

- [ ] T010 [P] [US1] Add API contract tests for `POST /api/v1/tasks` in `apps/api/src/modules/tasks/__tests__/tasks.routes.integration.test.ts`, covering required title, optional fields, 201 success, 400 validation, and 500 save failure envelopes (FR-001-FR-013)
- [ ] T011 [P] [US1] Add task service unit tests in `apps/api/src/modules/tasks/__tests__/tasks.service.test.ts`, covering whitespace-only title, equal or earlier end time, start-only, end-only, and unscheduled data (FR-006-FR-008, BR-001-BR-004)
- [ ] T012 [P] [US1] Add React Testing Library form tests in `apps/web/src/modules/tasks/__tests__/CreateTaskPage.test.tsx`, covering initial, loading, disabled, validation, success, and save-error states (FR-009, FR-012-FR-015)
- [ ] T013 [P] [US1] Add Playwright API scenarios for task creation success and failures in `tests/e2e/specs/api/create-task.api.spec.ts` (SC-001-SC-004)
- [ ] T014 [P] [US1] Add Playwright browser journey scenarios for dated, unscheduled, validation, and save-failure outcomes in `tests/e2e/specs/browser/create-task.spec.ts` (SC-001-SC-003)

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement task constants and route dependencies in `apps/api/src/modules/tasks/tasks.constants.ts` and `apps/api/src/modules/tasks/tasks.types.ts`
- [ ] T016 [US1] Implement the create service in `apps/api/src/modules/tasks/tasks.service.ts`, creating tasks with `completed=false` and preserving optional description/date/start/end values (FR-002-FR-005, FR-010, BR-005)
- [ ] T017 [US1] Implement shared input validation and time-range rules in `apps/api/src/modules/tasks/tasks.routes.ts`, rejecting whitespace-only title and end <= start on the same local date (FR-006-FR-009, BR-001-BR-004)
- [ ] T018 [US1] Mount the task router at `/api/v1/tasks` in `apps/api/src/app.ts` using existing request correlation, validation, rate-limit, and error middleware (FR-008-FR-013)
- [ ] T019 [P] [US1] Implement the web create-task API service in `apps/web/src/modules/tasks/services/create-task.ts` using the shared Zod contracts (FR-011-FR-013)
- [ ] T020 [P] [US1] Implement task form components and accessible field feedback in `apps/web/src/modules/tasks/components/TaskForm.tsx` and `apps/web/src/modules/tasks/components/TaskFieldError.tsx` (FR-009, FR-015)
- [ ] T021 [US1] Implement the task creation page and loading/disabled/success/error states in `apps/web/src/modules/tasks/pages/CreateTaskPage.tsx` (FR-011-FR-015)
- [ ] T022 [US1] Add the task creation route in `apps/web/src/app/routes.tsx` and export the feature page from `apps/web/src/modules/tasks/index.ts` (FR-011)

**Checkpoint**: User Story 1 independently creates dated or unscheduled tasks and reports validation/save outcomes accessibly

---

## Phase 4: Data, Contract, and Migration Verification

**Purpose**: Prove persistence and public contract changes against the repository's isolation and quality workflows

- [ ] T023 [P] Apply and validate the task migration against a disposable PostgreSQL test database using `corepack pnpm db:generate` and `corepack pnpm db:migrate`
- [ ] T024 [P] Run API integration tests with `corepack pnpm test:integration` and confirm created tasks preserve validated fields and begin incomplete
- [ ] T025 [P] Run contract and unit verification with `corepack pnpm test:unit` and confirm shared/API validation cases pass
- [ ] T026 Run browser/API smoke verification with `corepack pnpm test:api` and `corepack pnpm test:e2e`
- [ ] T027 Add migration data-preservation checks proving existing Task rows remain valid and retain existing title/completed values after the migration

---

## Phase 5: Accessibility and Cross-Cutting Verification

**Purpose**: Validate user-facing quality, repository gates, and no-false-success behavior

- [ ] T028 [P] Run automated WCAG 2.2 AA checks for the task creation journey using the repository's available browser/accessibility tooling and record any blocking findings
- [ ] T029 [P] Perform manual keyboard and screen-reader verification for labels, field errors, loading/disabled state, success, and save error
- [ ] T030 Run `corepack pnpm lint`, `corepack pnpm format:check`, `corepack pnpm typecheck`, and relevant unit/integration/E2E suites before completion
- [ ] T031 Run secret and security scans applicable to the feature by using the repository CI workflows or documented security checks, and record unavailable checks with reasons
- [ ] T032 Validate the feature against `specs/scrum-16-create-task/quickstart.md` and report the exact commands run and pass/fail result

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup; blocks all user story work
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **Data/Contract/Migration Verification (Phase 4)**: Depends on User Story 1 implementation
- **Accessibility/Polish (Phase 5)**: Depends on User Story 1 implementation and relevant verification

### User Story Dependencies

- **User Story 1 (P1)**: Independent; no later user story dependency

### Within User Story 1

- Contract and API/web tests come before or alongside implementation but do not impose test-first development
- Data model and shared contracts before API/web consumption
- API create route before browser create journey integration
- Core implementation before end-to-end validation

## Parallel Opportunities

- T006-T008 shared contract tasks can proceed together.
- T010-T014 verification tasks can proceed in parallel after contracts are stable.
- T015 and T019-T020 independent module files can proceed in parallel.
- T023-T025 verification commands can run in parallel only when backed by isolated database/test processes.
- T028-T029 accessibility verification can proceed in parallel.

## Parallel Example: User Story 1

```text
T010 - API contract/integration tests
T011 - API service unit tests
T012 - React form unit tests
T013 - Playwright API scenarios
T014 - Playwright browser scenarios
T015 - API constants/types
T019 - Web API service
T020 - Accessible form components
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases
2. Complete User Story 1 tests and implementation
3. STOP and validate the dated/unscheduled create journey independently
4. Run migration, contract, API, browser, and accessibility verification

### Incremental Delivery

This feature is one P1 story and therefore constitutes the MVP increment. Later stories should consume the completed task model and creation contract without reopening SCRUM-16 scope.
