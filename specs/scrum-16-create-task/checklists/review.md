# Requirements Review Checklist: Create a Task

**Purpose**: Provide a balanced reviewer-owned requirements-quality review for SCRUM-16
**Created**: 2026-11-26
**Feature**: [spec.md](../spec.md)

**Note**: This custom checklist is generated for a standard PR-review depth based on the specification and implementation plan.
**Review Ownership**: This checklist is a reviewer-owned requirements-quality review artifact. Mark an item `[x]` only when the reviewer determines the requirements-quality criterion is satisfied.
**Marker Semantics**: `[x]` means the criterion has been reviewed and satisfied for requirements quality. It does not mean implementation work is complete.

## Requirement Completeness

- [ ] CHK001 - Are required and optional task data fields explicitly enumerated and mutually distinguished? [Completeness, Spec §5.1]
- [ ] CHK002 - Are requirements defined for every in-scope task field, including title, description, date, start time, and end time? [Completeness, Spec §1.3]
- [ ] CHK003 - Are loading, disabled, initial, success, empty, and error states each fully defined in the requirements? [Completeness, Spec §6.2]
- [ ] CHK004 - Are creation outcomes for both dated and undated tasks explicitly covered? [Completeness, Spec §2]
- [ ] CHK005 - Are save retry or resubmission requirements defined after a failed submission? [Gap, Exception Flow]
- [ ] CHK006 - Are all explicitly excluded capabilities clearly separated from in-scope creation behavior? [Completeness, Spec §1.3]

## Requirement Clarity

- [ ] CHK007 - Is "nonblank title" defined consistently enough to distinguish valid characters from whitespace-only input? [Clarity, Spec §4.1 BR-001]
- [ ] CHK008 - Is "start/end time" formatting specified without relying on implementation assumptions? [Clarity, Spec §5.1]
- [ ] CHK009 - Is "on the chosen date or in the unscheduled list" sufficiently precise for placement across all accepted scheduling combinations? [Clarity, Spec §2]
- [ ] CHK010 - Are the boundaries of valid paired times measurable for equal, earlier, and later end times? [Clarity, Spec §4.1 BR-003]
- [ ] CHK011 - Is "actionable error" defined with criteria for what recovery guidance must communicate? [Ambiguity, Spec §6.2]
- [ ] CHK012 - Are "visible success" and success announcement requirements objective rather than dependent on subjective presentation? [Ambiguity, Spec §6.2]

## Requirement Consistency

- [ ] CHK013 - Do the title validation rules align across functional requirements, business rules, scenarios, and data validation? [Consistency, Spec §3/§4.1/§5.2]
- [ ] CHK014 - Do the independently optional date and time rules align across alternative scenarios, data requirements, and edge cases? [Consistency, Spec §2/§4.1/§5.1]
- [ ] CHK015 - Do success and no-false-success requirements agree across acceptance criteria, UI states, and reliability criteria? [Consistency, Spec §2/§6.2/§7]
- [ ] CHK016 - Is the unscheduled-task behavior consistent when no date is supplied but a time is supplied? [Consistency, Spec §2/§9.3]

## Acceptance Criteria Quality

- [ ] CHK017 - Can the dated-task success criterion be verified independently for submitted description and schedule values? [Measurability, Spec §8 SC-001]
- [ ] CHK018 - Can the blank-title and invalid-time outcomes be verified as blocking creation with associated accessible errors? [Measurability, Spec §8 SC-002]
- [ ] CHK019 - Can save failure outcomes be objectively evaluated for no false success and no task entry? [Measurability, Spec §8 SC-003]
- [ ] CHK020 - Can the incomplete status of every new task be verified without implementation-specific assertions? [Measurability, Spec §8 SC-004]
- [ ] CHK021 - Is the keyboard and assistive-technology acceptance criterion measurable against defined interaction outcomes? [Measurability, Spec §8 SC-005]

## Scenario Coverage

- [ ] CHK022 - Are primary, unscheduled, date-only, start-only, end-only, and complete-time scenarios all addressed? [Coverage, Spec §2]
- [ ] CHK023 - Are blank-title, invalid-time-range, and save-failure exception flows each documented with a post-failure outcome? [Coverage, Exception Flow, Spec §2]
- [ ] CHK024 - Are repeated submission and loading-duration scenarios addressed sufficiently to prevent duplicate task creation? [Gap, Recovery Flow]
- [ ] CHK025 - Are partial form-state and retained-input requirements defined after validation or save failure? [Gap, Recovery Flow]

## Edge Case Coverage

- [ ] CHK026 - Is overnight scheduling intentionally excluded consistently in validation and data rules? [Edge Case, Spec §4.1 BR-004]
- [ ] CHK027 - Are date/time combinations containing one absent time explicitly covered rather than left to interpretation? [Edge Case, Spec §2]

## Accessibility Requirements

- [ ] CHK028 - Are accessible names required for every task creation control? [Completeness, Spec §6.3]
- [ ] CHK029 - Are field-level error associations specified for every possible validation error? [Completeness, Spec §6.3]
- [ ] CHK030 - Are loading, success, and error announcements specified for assistive technology? [Completeness, Spec §6.3]
- [ ] CHK031 - Are keyboard operation and visible focus requirements consistently specified for the full journey? [Consistency, Spec §6.4]

## Data and Reliability Requirements

- [ ] CHK032 - Are required, optional, and system-generated task attributes explicitly defined? [Completeness, Spec §5.1]
- [ ] CHK033 - Are data-preservation requirements defined for a failed save or interrupted creation journey? [Gap, Reliability]
- [ ] CHK034 - Is the rule that a new task begins incomplete documented consistently across requirements and success criteria? [Consistency, Spec §4.1 BR-005]
- [ ] CHK035 - Are migration rollback or recovery requirements specified for a schema change that fails or partially applies? [Gap, Assumption]

## Dependencies and Assumptions

- [ ] CHK036 - Is the assumption that start-only and end-only combinations are valid explicitly resolved and traceable? [Assumption, Spec §9.1 A-001]
- [ ] CHK037 - Is the assumption about save success and failure distinguishability confirmed by objective outcome requirements? [Assumption, Spec §9.1 A-003]

## Ambiguities and Conflicts

- [ ] CHK038 - Are there any unresolved conflicts between "time(s) may be absent" and time-without-date behavior? [Conflict, Spec §4.1/§9.3]
- [ ] CHK039 - Are "form loading" and "submission disabled" requirements consistent with repeated-save prevention? [Ambiguity, Spec §6.2]
- [ ] CHK040 - Are all open questions and clarifications reflected without obsolete alternatives or contradictory statements? [Traceability, Spec §9.2/§9.3]

## Notes

- Mark items `[x]` only after review confirms the requirement-quality criterion is satisfied
- Leave items unchecked when they still require clarification, correction, or reviewer evaluation
- `/speckit-implement` reads checklist checkbox state as a gate and must not modify markers
- `checklists/requirements.md` has a separate built-in lifecycle maintained by `/speckit-specify` and `/speckit-clarify`
- Link findings to relevant resources or documentation
