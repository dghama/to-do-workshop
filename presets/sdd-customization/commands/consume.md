## Feature specification is authoritative

Use the feature-context resolution and prerequisites supplied by the core
command and active integration. Read the complete resolved feature
specification in `FEATURE_DIR/spec.md` and treat it as the source of product
intent, scope, priorities, assumptions, and open questions. If it is missing or
ambiguous, stop and report that rather than inferring requirements.

Do not hard-code a repository helper, shell, branch scheme, issue tracker, or
feature-state mechanism. Follow the core command's read/write contract, and do
not move feature requirements into a separate document.

### Plan

Connect technical decisions to user outcomes. Record trade-offs and unresolved
technical questions separately from product decisions.

### Tasks

Group work by user scenario where that produces a coherent, demonstrable
outcome. Preserve scenario priorities and follow dependencies from the
effective task template and any project quality policy.

### Analyze

Treat the specification as authority for product outcomes and the plan as
authority for technical decisions. Report when a design choice changes user
behavior without support in the specification; remain read-only as required by
the core command.

### Implement

If work reveals a conflict between artifacts or behavior requiring an
unresolved product decision, pause that portion and ask rather than choosing
silently. Report material deviations and verification evidence without
rewriting requirements or design artifacts.
