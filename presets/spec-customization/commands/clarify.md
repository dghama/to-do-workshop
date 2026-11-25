## Clarify the customized specification

Before any hook or prerequisite step below, run
`.\scripts\resolve-feature-context.ps1` from the repository root and check its
exit status. Stop on failure; never use an old `.specify/feature.json`.
On a branch that does not match `feature/<JIRA-ID>-<short-name>`, ask the user
to select an existing `specs/<JIRA-ID>-<short-name>` directory explicitly,
then run the resolver with `-FeatureDirectory` and the selected value. A
previous pointer or environment variable is not an explicit selection. Do not
silently override conflicting `SPECIFY_FEATURE_DIRECTORY` or `SPECIFY_FEATURE`
environment variables; tell the user to clear or correct them. Run the
resolver again if the branch or selection changes before a subsequent command.
This is an agent instruction; direct script calls do not automatically run it.

After resolving `FEATURE_DIR`, read `FEATURE_DIR/spec.md` as the authoritative
feature specification.
Ask the Product Owner about missing or ambiguous behavior, record unanswered
questions under Open Questions, and apply actual answers to the relevant spec
sections. Do not turn assumptions into requirements.

Keep the specification in `FEATURE_DIR/spec.md` for clarification writes.
An Approved specification must have no open questions: if new questions arise,
do not silently change its status or leave it Approved with open questions;
ask the user how to proceed before writing. Never claim approval without
explicit authorization.
