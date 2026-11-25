## Outcome-focused specification

Use Spec Kit's standard feature-context resolution and hooks. Generate the
feature specification at the resolved feature's `spec.md`; do not move the
default specification into a separate documentation directory.
Resolve `spec-template` with the standard template resolver and write the
composed template directly to that `spec.md`. The use-case fields supplement
the core requirements and acceptance-criteria sections; do not create a second
use-case document.

Describe observable user or system outcomes. Organize requirements around
relevant user scenarios or use cases, with testable acceptance criteria,
important edge cases, and explicit scope. Distinguish known facts from
assumptions and unresolved decisions. Do not invent requirements or choose
implementation details that belong in the plan.

For each applicable scenario, cover the successful outcome and relevant
negative, error, and boundary behavior. Acceptance criteria must state an
observable result and measurable limits when the requirement calls for them.
For user-facing interfaces, identify relevant loading, empty, success, error,
and disabled states and express their behavior through the related scenarios.
Omit states and quality criteria that do not apply.

When source requirements or supporting documents are available, record their
identifiers or links and map them to the resulting requirements or scenarios.
Use only sources actually provided or inspected; do not imply that Jira or
another external system was accessed when it was not. Follow the consuming
repository's applicable accessibility and quality standards.

Preserve an existing specification unless the user explicitly requests an
update. Do not impose a role, issue tracker, branch naming scheme, identifier
format, or technology stack unless the user or another installed customization
provides it.
Do not claim approval or change a specification's status without explicit
authorization. An Approved specification must not retain unresolved Open
Questions.
