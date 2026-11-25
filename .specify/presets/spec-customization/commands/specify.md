## Customized specification workflow

These instructions override conflicting generation instructions in the standard
command below, but retain its hooks, feature directory resolution,
feature.json persistence, and completion reporting.

- Generate the default specification directly in `FEATURE_DIR/spec.md`.
- Resolve `spec-template` with the project's standard template resolver and
  write the resolved template directly to `FEATURE_DIR/spec.md`.
- Fill the template from evidence and answers from the Product Owner. Never
  invent facts, requirements, UI links, Jira stories, business rules, or
  guarantees.
- Preserve existing `spec.md` files unless the user explicitly requests an
  update. On a new feature, do not overwrite an existing specification.
- Use the Jira issue and feature slug for branch and feature-directory naming
  when the Jira naming preset is installed. Keep the existing feature directory
  when updating an existing specification.
- Create specifications with status `Draft`. Allowed statuses are Draft,
  Reviewed, Approved, Implemented, Tested, Done, and Obsolete. Do not claim
  approval or change status without explicit authorization.
- Place unsupported assumptions and unresolved decisions in `Open Questions`
  addressed to the Product Owner. Ask targeted questions where possible.
- Open Questions must be empty before setting status to `Approved`.
- Treat `FEATURE_DIR/spec.md` as `SPEC_FILE` for writing, clarification,
  quality validation, planning, task generation, and downstream commands.
- Before writing, execute the mandatory hooks and verify the branch, feature
  directory, and existing spec. Stop on missing hooks, hook failures, or
  mismatches. Never silently edit on `main`.
- Report the specification path and any outstanding Product Owner questions.
