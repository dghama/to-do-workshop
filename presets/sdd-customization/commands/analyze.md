## Feature specification is authoritative

Read the complete resolved feature specification in `FEATURE_DIR/spec.md` and
treat it as the source of product intent, scope, priorities, assumptions, and
open questions. If it is missing or ambiguous, stop and report that rather than
inferring requirements. Follow the core command's read/write contract; do not
hard-code a repository helper, shell, branch scheme, issue tracker, or
feature-state mechanism.

## Verify explicit requirement coverage

Use stable requirement and scenario references to assess task coverage. Treat
keyword matches as candidates for review, not proof that a requirement is
covered. Report requirements without an explicit, defensible task mapping and
tasks that have no clear requirement, scenario, or justified cross-cutting
purpose.

Remain read-only and preserve the core analysis command's severity rules,
Constitution checks, and output structure.
