## Feature specification is authoritative

Read the complete resolved feature specification in `FEATURE_DIR/spec.md` and
treat it as the source of product intent, scope, priorities, assumptions, and
open questions. If it is missing or ambiguous, stop and report that rather than
inferring requirements. Follow the core command's read/write contract; do not
hard-code a repository helper, shell, branch scheme, issue tracker, or
feature-state mechanism.

## Implement only approved work

Use the approved tasks and plan to define implementation scope. Do not add
unrelated setup, ignore-file, dependency, or cleanup changes merely because a
generic workflow suggests them. If a necessary prerequisite is outside the
approved tasks, explain why and ask before expanding scope.

Pause work that depends on an unresolved product decision. Follow repository
conventions and applicable quality policies, run relevant documented
validation, and report exact results and material deviations. Do not mark a
task complete unless its work and required verification are complete.
