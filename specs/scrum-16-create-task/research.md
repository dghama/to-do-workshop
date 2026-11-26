# Phase 0 Research: Create a Task

## Task storage

- **Decision**: Extend the existing Prisma `Task` model and expose a versioned API rather than introduce local-only or separate storage.
- **Rationale**: PostgreSQL and Prisma are already established foundation dependencies, and SCRUM-16 requires persisted task creation. The existing migration workflow and database boundaries support a reviewed schema change.
- **Alternatives considered**: Browser-only storage was rejected because SCRUM-39 and SCRUM-40 define separate guest/account persistence stories; task creation should remain independent of that follow-on choice.

## Shared create contract

- **Decision**: Use Zod schemas in `packages/shared/src/modules/tasks` for the create request and response, with the API and web consuming the same exports.
- **Rationale**: The constitution requires shared contracts where appropriate, and the repository already uses Zod shared types and the `{ data }`/`{ error }` envelopes.
- **Alternatives considered**: API-only validation was rejected because it would duplicate web data typing and weaken contract consistency.

## Schedule representation

- **Decision**: Store a scheduled date as a local calendar date and start/end values as local wall-clock strings. Enforce end-after-start only when both values are present.
- **Rationale**: The Jira rules explicitly define same-local-date validation and prohibit overnight intervals. Separate fields preserve independently optional values and unscheduled tasks.
- **Alternatives considered**: Instant timestamps were rejected because they introduce timezone interpretation that SCRUM-16 did not require and can obscure date-only tasks.

## Time-only entries

- **Decision**: Preserve a time without a date and keep the task unscheduled, based on the resolved clarification.
- **Rationale**: This is the confirmed product behavior and avoids changing the task's placement unless a date is supplied.
- **Alternatives considered**: Requiring a date would contradict the clarified decision.

## Save failure behavior

- **Decision**: Use the existing safe API error envelope and let the web show a retryable, field-independent save error.
- **Rationale**: The API foundation already converts internal failures to generic public messages and logs details server-side.
- **Alternatives considered**: Exposing database errors was rejected by the constitution.

## Remaining clarifications

No unresolved product clarifications remain in SCRUM-16. Numeric performance, volume, retention, and authorization targets were not specified and must not be invented.
