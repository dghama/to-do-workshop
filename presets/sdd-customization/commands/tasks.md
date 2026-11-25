## Feature specification is authoritative

Read the complete resolved feature specification in `FEATURE_DIR/spec.md` and
treat it as the source of product intent, scope, priorities, assumptions, and
open questions. If it is missing or ambiguous, stop and report that rather than
inferring requirements. Follow the core command's read/write contract; do not
hard-code a repository helper, shell, branch scheme, issue tracker, or
feature-state mechanism.

## Trace tasks to requirements

For each task that implements or verifies behavior, include the relevant
functional requirement, success criterion, or user-story reference in its
description (for example, `FR-001`, `SC-002`, or `US1`). A shared task may
reference multiple items. Keep the core task format and use repository paths.

Every in-scope buildable requirement must have at least one implementation or
verification task, as appropriate. Do not count keyword similarity alone as
evidence of coverage. Include only technical areas and test layers justified
by the plan and repository conventions. Represent unresolved product
decisions as explicit dependencies or blockers rather than implementing an
assumption.
