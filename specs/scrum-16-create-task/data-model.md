# Data Model: Create a Task

## Task

| Field | Type | Required | Validation and behavior |
| --- | --- | --- | --- |
| `id` | UUID | System-generated | Unique immutable identity |
| `title` | String | Yes | Trimmed for validation; must contain at least one non-whitespace character |
| `description` | String | No | Optional text |
| `scheduledDate` | Local ISO date string | No | Optional `YYYY-MM-DD` calendar date |
| `startTime` | Local wall-clock string | No | Optional `HH:mm` |
| `endTime` | Local wall-clock string | No | Optional `HH:mm`; when paired with `startTime`, must be later on the same local date |
| `completed` | Boolean | Yes | Defaults to `false` for a new task |
| `createdAt` | Timestamp | System-generated | Creation time |
| `updatedAt` | Timestamp | System-generated | Last update time |

## State transitions

- Initial form state: no persisted task.
- Valid submission: form enters loading state; API creates `Task` with `completed=false`.
- Validation failure: no persisted task and the relevant field error is displayed.
- Save failure: no persisted task and an actionable save error is displayed.
- Success: exactly one persisted task is associated with the submitted date/time values and shown in the selected-date or unscheduled view.

## Validation rules

- Reject missing, empty, or whitespace-only title.
- Accept absent description, date, start time, and end time.
- Accept start-only and end-only values.
- If both times are present, reject when end is equal to or earlier than start.
- Do not support overnight intervals.
- Preserve an entered time even when no date is present and keep the task unscheduled.
- Never create a task after validation or save failure.
