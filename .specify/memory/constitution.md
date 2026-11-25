<!--
Sync Impact Report
Version change: unratified scaffold → 1.0.0 (initial adoption)
Added principles:
- I. Modular Monolith and Explicit Boundaries
- II. Cohesive Modules, Stable Contracts, and Deliberate Evolution
- III. Secure Data and Reliable Operations
- IV. Accessible and Inclusive Experiences
- V. Verifiable Quality and Responsible Change
Added sections:
- Technology, Data, Security, and Operations
- Verification, Delivery, and AI Governance
Removed sections: None
Follow-up TODOs:
- Confirm the original ratification date; no adoption date is recorded in the repository.
-->

# To-Do Workshop Constitution

## Core Principles

### I. Modular Monolith and Explicit Boundaries
The repository MUST preserve its pnpm workspace boundaries: `apps/web` owns browser behavior,
`apps/api` owns HTTP and server behavior, `packages/shared` owns intentionally shared contracts,
and `tests/e2e` owns browser and API smoke tests. Within each application, feature code MUST live
in cohesive modules with private implementation details; cross-module collaboration MUST use
deliberate public contracts rather than reach-through imports. The web and API are distinct
applications; the term modular monolith applies within each application and does not require
combining their runtimes. Shared code MUST remain limited to behavior genuinely needed by more
than one package. Circular dependencies MUST NOT be introduced.

**Verification:** Review import paths and package exports for boundary violations; use lint rules
or architecture tests to enforce boundaries when practical. Any new deployable or cross-module
dependency requires an explicit rationale in the design.

### II. Cohesive Modules, Stable Contracts, and Deliberate Evolution
The project MUST use its established TypeScript, React, Express, Zod, Prisma, PostgreSQL, Jest,
and Playwright stack unless an approved architectural decision records a concrete reason to
change it. The TypeScript strict settings, pnpm workspace, and explicit shared-package exports
MUST be preserved. Feature modules MUST own the logic, UI, validation, and tests specific to
their domain; shared components, services, types, and utilities MUST be promoted only when
multiple real consumers justify a stable shared contract. New dependencies and abstractions
MUST address an evidenced requirement, fit existing platform support, and avoid duplicating
existing capabilities.

API endpoints MUST use the established versioned `/api/v1` boundary, shared Zod contracts where
appropriate, validated inputs, and the documented success and error envelopes. Route handlers
MUST remain focused on HTTP concerns; domain behavior and persistence concerns MUST be separated
when their complexity warrants it. The frontend MUST keep route composition, feature behavior,
shared UI primitives, and API access clearly separated, and MUST use the existing server-state
library when server state is introduced.

**Verification:** Plans and reviews identify affected modules and contracts; CI type-checking
and tests validate public interfaces. New dependencies, abstractions, or contract changes include
their rationale and compatibility impact in the feature plan or review.

### III. Secure Data and Reliable Operations
All data entering a trust boundary MUST be validated, and authorization MUST be enforced before
accessing protected data or performing protected actions. Secrets MUST NOT be committed or
exposed to browser code, logs, test reports, or error responses. Errors returned to clients MUST
not disclose internal exceptions or sensitive data. Operational logs MUST be structured and
redact credentials and other sensitive values.

Database changes MUST be represented by reviewed, versioned Prisma migrations committed with
the feature. Migrations MUST preserve existing data unless the approved requirement explicitly
allows its removal; risky or destructive changes MUST include a compatibility, backup, and
recovery approach. Schema deployment MUST remain explicit and MUST NOT run implicitly at
application startup. Database-backed tests MUST use isolated disposable data stores.

**Verification:** Review validation and authorization at each affected boundary, inspect logs
and responses for sensitive data, and run migrations against an isolated PostgreSQL instance.
Migration review records data-preservation and recovery considerations proportionate to risk.

### IV. Accessible and Inclusive Experiences
Accessibility MUST be designed, specified, implemented, and verified throughout every user-facing
change; it MUST NOT be deferred to final polish. WCAG 2.2 Level AA is the default target unless
the project records a justified, applicable alternative. Interfaces MUST use semantic HTML and
valid ARIA only when native semantics are insufficient; support keyboard operation, visible and
managed focus, screen-reader announcements, readable contrast, responsive layouts, and reduced
motion where relevant. Forms MUST provide programmatic labels, instructions, and field-level
error associations. Information and state MUST NOT be conveyed by color alone.

**Verification:** Specifications include relevant accessibility acceptance criteria. Changed
interfaces receive automated accessibility checks with axe-core or a compatible equivalent where
practical, plus manual keyboard and screen-reader review for affected journeys. Findings that
block WCAG 2.2 AA conformance MUST be resolved or handled through the documented exception
process before release.

### V. Verifiable Quality and Responsible Change
Every change MUST have tests appropriate to its risk and behavior: focused unit tests for isolated
logic, integration tests for module and API behavior, contract tests for changed public
interfaces, and end-to-end tests for critical user journeys. Tests MUST assert observable
requirements, remain isolated and deterministic, and avoid copying implementation details as
their oracle. Regressions MUST be covered at the layer that best proves the corrected behavior.
Features MUST define testable acceptance criteria, including relevant accessibility, security,
data integrity, reliability, and performance expectations.

Changes MUST pass applicable repository quality gates before merge: lint, formatting, strict
type-checking, relevant unit and integration tests, migration validation, security and secret
scans, and applicable browser/API tests. Pull requests MUST state relevant validation results
and disclose skipped checks with reasons. Reviewers MUST assess contract and boundary impact;
significant architectural changes, security-sensitive changes, and risky migrations require
explicit human review.

**Verification:** Use the repository scripts and CI workflow as the source of truth for gates.
Review test coverage against acceptance criteria and inspect CI results; never report a check as
passing unless it was run and its result observed.

## Technology, Data, Security, and Operations

The Node.js and pnpm versions MUST remain aligned with the repository engine, package-manager,
CI, and container configuration. Dependency versions MUST be reproducible from the committed
lockfile, and dependency or toolchain changes MUST be reviewed for compatibility and security.
Containers and local environments MUST use declared configuration, health checks where
applicable, and environment isolation. Environment-specific values MUST be injected through
ignored local files or managed environment secrets; only intentionally public `VITE_` values
may reach browser code. Database readiness, migrations, and seed behavior MUST remain explicit.

The API MUST preserve structured request correlation and safe error handling. Security controls
such as security headers, origin restrictions, request limits, rate limiting, secret scanning,
and static analysis MUST be maintained at the relevant boundaries and adjusted when the threat
surface changes. CI configuration MUST use least-privilege permissions and MUST NOT expose
production secrets to untrusted pull requests. Deployment is not currently performed by CI;
any future deployment workflow MUST add environment protection and operational validation
before enabling release.

**Verification:** Review environment access and CI permissions, validate container
configuration, run migration checks against disposable PostgreSQL, and confirm security scans
and health checks remain part of the relevant pipeline.

## Verification, Delivery, and AI Governance

Feature specifications and plans MUST state user-visible behavior, acceptance criteria, affected
modules and contracts, and relevant quality requirements. Implementation tasks MUST map to that
design. Pull requests MUST use the repository template and identify change scope, validation,
security/environment impact, and any justified exception. Changes MUST be reviewed against this
Constitution; an unchecked template item is not evidence that a requirement is satisfied.

AI-generated specifications, plans, code, tests, migrations, configuration, and documentation
MUST meet the same standards as human-authored work. Agents MUST inspect repository context,
respect module boundaries, validate generated work against requirements, avoid unnecessary
dependencies and duplication, and report unverified or unresolved items accurately. Agent
outputs MUST contain only the requested deliverable in its appropriate native format, without
conversational framing or closing text: source-code requests return code only, documentation
requests return Markdown only, configuration requests return valid configuration, and
structured-data requests return the requested structure. Significant architectural, security,
and data-risk decisions require human review regardless of AI assistance.

**Verification:** Review generated artifacts against repository conventions and acceptance
criteria, execute relevant quality gates, and confirm output format and human-review requirements
for material changes.

## Governance

This Constitution is the governing source for durable engineering principles and takes
precedence over conflicting feature plans, tasks, and implementation shortcuts. Changes to
principles require a documented amendment, an impact assessment for existing modules and
workflows, and approval from the project maintainer or designated architecture reviewer.
Temporary exceptions MUST document the affected principle, scope, rationale, risk controls,
approver, and expiry or revisit date; exceptions MUST NOT silently become permanent policy.

The version follows semantic versioning: MAJOR for backward-incompatible governance changes or
principle removals, MINOR for new principles or materially expanded requirements, and PATCH for
clarifications that do not change obligations. Pull-request reviewers MUST assess compliance
with this Constitution and record approved exceptions. The Constitution MUST be reviewed when
architecture, stack, security posture, accessibility requirements, or delivery practices change
materially. Automated checks SHOULD enforce stable, machine-verifiable rules where practical;
manual review remains required for architectural intent and user experience.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date not recorded | **Last Amended**: 2026-11-25
