# Quickstart Validation: Create a Task

## Primitives

- Start from the repository root.
- Use the existing environment setup and isolated database documented in `README.md` and `docs/development.md`.
- Apply migrations explicitly; do not rely on application startup to change the schema.

## Planned validation commands

```sh
corepack pnpm lint
corepack pnpm format:check
corepack pnpm typecheck
corepack pnpm test:unit
corepack pnpm test:integration
corepack pnpm test:api
corepack pnpm test:e2e
```

Run migration and database validation with the repository's isolated test database:

```sh
corepack pnpm db:generate
corepack pnpm db:migrate
```

## Observable scenarios

1. **Unscheduled task**
   - Enter a nonblank title and save with no date or times.
   - Expect HTTP 201, `completed=false`, and a task visible in the unscheduled view.

2. **Dated task**
   - Enter a title, optional description, and scheduled date.
   - Save and verify the task appears on the selected date.

3. **Optional one-sided times**
   - Submit a start-only or end-only time.
   - With no date, keep the task unscheduled and preserve the entered time.
   - With a date, preserve the entered time on that date.

4. **Blank title**
   - Submit whitespace as the title.
   - Expect no task creation and an accessible title-field error.

5. **Invalid paired times**
   - Submit equal times or an end earlier than start.
   - Expect no task creation and an accessible time error.

6. **Save failure**
   - Force the save to fail in integration or browser test setup.
   - Expect no created task, no false success state, and an actionable error.

7. **Loading and disabled**
   - While save is in progress, verify visible loading feedback and disabled repeated submission.

8. **Accessibility**
   - Complete the journey using keyboard navigation.
   - Verify labels, visible focus, field error associations, status announcements, contrast, and layout behavior.

## Contract references

- [Create task API contract](contracts/create-task.openapi.yaml)
- [Task data model](data-model.md)
- [SCRUM-16 specification](spec.md)
