# Feature Specification: Create a Task

**Feature ID**: SCRUM-16
**Feature Branch**: feature/scrum-16-create-task
**Parent Issue**: SCRUM-9
**Created**: 2026-11-26
**Status**: Draft
**Source**: https://adghammobelite.atlassian.net/browse/SCRUM-16

---

## 1. Feature Context

### 1.1 Objective

Allow a planner user to record work with the information needed to identify, describe, and optionally schedule a task.

### 1.2 Original User Story

As a planner user, I want to capture a task with its details and optional schedule so that work is recorded.

### 1.3 Scope

**In Scope**

- Create a new task with a required title and optional description.
- Optionally schedule the task with a date and independently optional start and end times.
- Validate the title and same-day time range before creation.
- Show loading, disabled, success, validation, and save-error states.
- Place a successfully created task on the chosen date or in the unscheduled list.

**Out of Scope**

- Recurrence.
- Attachments.
- Task collaboration.
- Editing, deleting, completing, or reopening an existing task.
- Subtasks.
- Reminders.

### 1.4 Related Work Items

| Jira ID | Relationship | Description |
| --- | --- | --- |
| SCRUM-9 | Parent | M01 - Task Management epic |
| SCRUM-15 | Blocks | M01-02 - Edit a Task |
| SCRUM-17 | Blocks | M01-04 - Delete a Task |
| SCRUM-21 | Blocks | M01-03 - Complete or Reopen a Task |
| SCRUM-19 | Blocks | M01-05 - Manage Subtasks |
| SCRUM-20 | Blocks | M02-01 - View a Day |
| SCRUM-28 | Blocks | M03-01 - Copy Tasks Between Days |
| SCRUM-26 | Blocks | M02-05 - Find Unscheduled and Completed Tasks |
| SCRUM-25 | Blocks | M04-03 - Set Task Priority |
| SCRUM-24 | Blocks | M04-04 - Filter and Sort Tasks |
| SCRUM-29 | Blocks | M04-02 - Manage Categories |
| SCRUM-30 | Blocks | M04-01 - Assign Task Color |
| SCRUM-31 | Blocks | M05-02 - See Overdue and Upcoming Tasks |
| SCRUM-36 | Blocks | M05-01 - View Today's Tasks and Progress |
| SCRUM-39 | Blocks | M07-01 - Persist Guest Tasks Locally |
| SCRUM-40 | Blocks | M07-02 - Persist Account Tasks in the Cloud |
| SCRUM-41 | Blocks | M08-01 - Set a Task Reminder |

---

## 2. User Scenarios & Testing

### US-01: Create a Scheduled or Unscheduled Task

**Priority**: High

**Description**: A planner enters a task title and optional details, saves the task, and sees it in the chosen date view or unscheduled list.

**Independent Test**: Submit a task with a valid title and each supported optional scheduling combination, then verify that the created task and its display location match the submitted details.

**Acceptance Scenarios**

- **Given** the task form is ready
- **When** the planner enters a nonblank title and optional valid description, date, start time, and end time
- **Then** the task is created with the submitted details and appears on the chosen date

- **Given** the task form is ready
- **When** the planner enters a nonblank title and leaves the date and both times empty
- **Then** the task is created as unscheduled and appears in the unscheduled list

### Alternative Scenarios

- A task may have a date without either time.
- A task may have a date and only a start time.
- A task may have a date and only an end time.
- A task may have a date with a start time before an end time on the same local date.
- A task may have a start or end time without a scheduled date; it remains unscheduled and preserves the entered time value.

### Error Scenarios

- A blank or whitespace-only title blocks creation and produces an accessible field-level error.
- An end time equal to or earlier than the start time on the same local date blocks creation and produces an accessible field-level error.
- A failed save leaves the unscheduled or selected-date view free of a falsely successful task and presents an actionable error.
- A successful save visibly confirms success and displays the created task.

### Edge Cases

- A whitespace-only title is invalid.
- The date, start time, and end time may each be absent.
- Overnight tasks are not supported; an end time equal to or earlier than the start time is invalid on the same local date.
- Optional start/end times are independent, so a start-only or end-only task is valid.
- A failed save must not create or display the task.

---

## 3. Functional Requirements

| ID | Requirement | Source | Classification |
| --- | --- | --- | --- |
| FR-001 | The planner-facing creation flow MUST require a nonblank title before a task can be created. | SCRUM-16 AC2 | Explicit |
| FR-002 | The creation flow MUST accept an optional description. | SCRUM-16 Description/Data Requirements | Explicit |
| FR-003 | The creation flow MUST accept an optional scheduled date. | SCRUM-16 Description/Data Requirements | Explicit |
| FR-004 | The creation flow MUST accept optional start and end times independently. | SCRUM-16 Description/Business Rules | Explicit |
| FR-005 | The system MUST allow a task with no scheduled date and keep it unscheduled. | SCRUM-16 AC1/Business Rules | Explicit |
| FR-006 | The system MUST block creation when the title contains only whitespace. | SCRUM-16 AC2 | Explicit |
| FR-007 | The system MUST block creation when both times exist and the end time is not later than the start time on the same local date. | SCRUM-16 AC2/Business Rules | Explicit |
| FR-008 | The system MUST not create a task after validation failure. | SCRUM-16 AC2 | Explicit |
| FR-009 | The system MUST show accessible validation errors at the fields that fail. | SCRUM-16 AC2/UI/UX Requirements | Explicit |
| FR-010 | The system MUST create a valid task with its submitted details and mark it incomplete. | SCRUM-16 AC1/Data Requirements | Explicit |
| FR-011 | A successfully created task MUST appear on its chosen date or in the unscheduled list. | SCRUM-16 AC1 | Explicit |
| FR-012 | The system MUST show a visible success outcome only after save succeeds. | SCRUM-16 AC3 | Explicit |
| FR-013 | The system MUST show an actionable error and no false success state when save fails. | SCRUM-16 AC3 | Explicit |
| FR-014 | The form MUST disable submission and show loading behavior while a save is in progress. | SCRUM-16 UI/UX Requirements | Explicit |
| FR-015 | The creation interaction MUST support keyboard use and accessible labels. | SCRUM-16 UI/UX Requirements | Explicit |

Classification:

- Explicit: Directly specified in Jira.
- Inferred: Necessary interpretation of an explicit requirement.
- Proposed: Additional recommendation requiring approval.

---

## 4. Business Rules & Constraints

### 4.1 Business Rules

| ID | Rule | Source | Classification |
| --- | --- | --- | --- |
| BR-001 | Title is required and must contain at least one non-whitespace character. | SCRUM-16 Description/AC2 | Explicit |
| BR-002 | Date, start time, and end time may each be absent. | SCRUM-16 Business Rules | Explicit |
| BR-003 | If both start and end times exist, end must follow start on the same local date. | SCRUM-16 Business Rules | Explicit |
| BR-004 | Overnight tasks are not supported. | SCRUM-16 Business Rules | Explicit |
| BR-005 | A newly created task begins incomplete. | SCRUM-16 Data Requirements | Explicit |

### 4.2 Constraints

- The feature does not implement recurrence, attachments, collaboration, editing, deletion, completion, reopening, subtasks, or reminders.
- Schedule values are interpreted against the user's local date.

---

## 5. Data Requirements

### 5.1 Entities

**Entity: Task**

| Attribute | Description | Required | Constraints |
| --- | --- | --- | --- |
| Title | The user-entered task name. | Yes | Nonblank |
| Description | Optional additional task information. | No | Text |
| Scheduled date | Optional local date on which the task appears. | No | Local date |
| Start time | Optional start time. | No | Independent of end time |
| End time | Optional end time. | No | If paired, later than start on the same local date |
| Completion status | Whether the task is complete. | Yes | New tasks begin incomplete |

### 5.2 Data Validation

- Reject a missing, empty, or whitespace-only title.
- Reject paired times that end at or before start on the same local date.
- Do not create a task when validation fails or save fails.
- Preserve the task's scheduled or unscheduled placement according to submitted data.

---

## 6. User Interface & Interaction Requirements

### 6.1 UI Components

- A task creation form.
- Title and description fields.
- Optional date and time controls.
- Save action and save outcome feedback.
- Validation feedback associated with the relevant fields.

### 6.2 UI States

| State | Expected Behavior |
| --- | --- |
| Initial | The form is available with no submitted task and no validation error. |
| Loading | A save in progress is visible; submission is disabled. |
| Success | A successful save is confirmed and the task is visible in its chosen date or unscheduled view. |
| Empty | An unscheduled task with no date remains valid and is shown in the unscheduled list. |
| Error | Validation or save errors identify what to change or retry without falsely reporting success. |
| Disabled | Save is unavailable while loading or otherwise blocked by an in-progress save. |

### 6.3 Interaction Rules

- All form controls MUST have accessible labels.
- Save and validation feedback MUST be operable and understandable with a keyboard and screen reader.
- Validation feedback MUST be associated with the affected field.
- Save completion feedback MUST be announced to assistive technology.
- The layout MUST remain usable across supported responsive viewport sizes.

### 6.4 Accessibility

- Semantic structure and accessible names.
- Keyboard operability.
- Visible focus indicators.
- Accessible validation and error feedback.
- Appropriate screen-reader announcements.
- Sufficient color contrast.
- WCAG 2.2 Level AA as the project accessibility standard.

---

## 7. Quality Requirements

| Category | Requirement | Source |
| --- | --- | --- |
| Security | Validation and save outcomes MUST not expose internal errors or sensitive data. | Constitution III |
| Reliability | A failed save MUST not create or falsely confirm a task. | SCRUM-16 AC3 |
| Accessibility | Affected journeys MUST meet WCAG 2.2 Level AA, including keyboard operation, visible focus, accessible labels, field error associations, screen-reader feedback, readable contrast, and reduced motion where relevant. | Constitution IV |
| Compatibility | Schedule values MUST be interpreted against the user's local date; overnight intervals are out of scope. | SCRUM-16 Business Rules |

---

## 8. Success Criteria

| ID | Criterion | Validation Method |
| --- | --- | --- |
| SC-001 | A user can create a valid dated or unscheduled task and see it in the correct location on the first successful save attempt. | End-to-end task creation scenarios |
| SC-002 | All blank-title, equal-time, and end-before-start submissions are blocked and show associated accessible errors in 100% of tested cases. | Validation unit and integration scenarios |
| SC-003 | A save failure produces an actionable error and no task entry in 100% of tested failure cases. | Save failure integration/end-to-end scenarios |
| SC-004 | A created task is marked incomplete in 100% of tested successful creations. | Data and integration validation |
| SC-005 | The complete create journey can be completed with a keyboard, and all field errors and save outcomes are announced accessibly. | Manual keyboard/screen-reader review plus automated accessibility checks |

---

## 9. Assumptions & Open Questions

### 9.1 Assumptions

| ID | Assumption | Rationale | Validation Status |
| --- | --- | --- | --- |
| A-001 | Start-only and end-only time combinations are valid. | Jira states that start and end times are independently optional. | Confirmed |
| A-002 | A scheduled date without times and an unscheduled task are both valid. | Jira explicitly describes these as valid forms. | Confirmed |
| A-003 | Save success and failure can be distinguished clearly enough to prevent false success. | Jira AC3 requires success visibility and actionable failure feedback. | Unconfirmed |

### 9.2 Open Questions

No open questions remain.

### 9.3 Clarifications

The user clarified that a start or end time entered without a scheduled date is preserved, and the task remains unscheduled.

---

## 10. Use Case Details

### UC-001: Create a Task

**Primary Actor**: Planner user

**Goal**: Record a task with valid details and optional scheduling.

**Preconditions**

- The planner can access the task creation form.

**Main Success Scenario**

1. The planner opens the task creation form.
2. The planner enters a nonblank title and any optional description.
3. The planner optionally enters a scheduled date and optional start/end times.
4. The planner saves the task.
5. The system validates the title and paired time range.
6. The system saves the task as incomplete.
7. The system confirms success and displays the task on the selected date or in the unscheduled list.

**Alternative Flows**

- The planner creates an unscheduled task without a date or times.
- The planner creates a task with a date and optional one-sided or complete time information.

**Exception Flows**

- Blank title: stop creation and show an accessible title error.
- Invalid time range: stop creation and show an accessible time error.
- Save failure: keep the form available, show an actionable error, and do not show success or create a task.

**Postconditions**

- Success: A valid incomplete task exists and is visible in the correct location.
- Failure: No task exists for a validation or save failure.

---

## 11. Requirement Traceability

| Jira Source | Scenario | Requirement | Validation |
| --- | --- | --- | --- |
| SCRUM-16 AC1 | US-01 | FR-002, FR-003, FR-004, FR-005, FR-010, FR-011 | Create successful scenarios |
| SCRUM-16 AC2 | US-01 | FR-001, FR-006, FR-007, FR-008, FR-009 | Blank-title and time-boundary scenarios |
| SCRUM-16 AC3 | US-01 | FR-012, FR-013 | Save success and failure scenarios |
| SCRUM-16 UI/UX | US-01 | FR-014, FR-015 | Loading, disabled, keyboard, and accessibility scenarios |
| SCRUM-16 Data Requirements | US-01 | FR-010, BR-005 | Task data validation |

---

## 12. Specification Readiness

**Status**: READY FOR PLANNING

### Validation Checklist

- [x] Original Jira User Story preserved.
- [x] Scope and out-of-scope identified.
- [x] Acceptance criteria covered.
- [x] Functional requirements are testable.
- [x] Requirements have source traceability.
- [x] Inferred and proposed requirements are identified.
- [x] Contradictions are documented.
- [x] Open questions are resolved.
- [x] Relevant quality requirements are covered.
- [x] No unsupported technical implementation decisions.

**Blocking Issues**

- None.

**Review Notes**

- The specification remains at Draft status. No approval or readiness to plan has been claimed.
