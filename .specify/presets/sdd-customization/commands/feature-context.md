## Feature specification is authoritative

Use the feature-context resolution and prerequisites supplied by the core
command and active integration. Read the complete resolved feature
specification in `FEATURE_DIR/spec.md` and treat it as the source of product
intent, scope, priorities, assumptions, and open questions. If it is missing or
ambiguous, stop and report that rather than inferring requirements.

Follow the core command's read/write contract. Do not hard-code a repository
helper, shell, branch scheme, issue tracker, or feature-state mechanism, and do
not move feature requirements into a separate document.
