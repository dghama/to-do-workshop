## Feature specification is authoritative

Read the complete resolved feature specification in `FEATURE_DIR/spec.md` and
treat it as the source of product intent, scope, priorities, assumptions, and
open questions. If it is missing or ambiguous, stop and report that rather than
inferring requirements. Follow the core command's read/write contract; do not
hard-code a repository helper, shell, branch scheme, issue tracker, or
feature-state mechanism.

## Connect design to requirements

Use the appended Feature Impact Assessment in the plan template for relevant
areas only. Classify each included area using its defined options, cite
repository evidence, and connect the impact to specification requirements or
scenarios. Do not mark an area as new or reusable without inspecting the
repository.

Keep product decisions distinct from technical decisions. Record technical
unknowns, alternatives, trade-offs, compatibility impacts, and the repository
evidence that supports the selected design in the appropriate plan sections.
Apply the consuming repository's Constitution and quality policies; do not
repeat or weaken them.
