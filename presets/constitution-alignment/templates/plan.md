## Repository Alignment and Verification Strategy

### Repository Evidence

Record the actual repository paths and conventions relevant to this feature:

- Affected applications, packages, modules, and their public boundaries.
- Existing implementations, shared contracts, and configuration conventions.
- Documented test, lint, type-check, migration, security, and accessibility
  commands that apply.

Do not include hypothetical directories, components, tools, or dependencies.

### Architecture and Verification Impact

Explain the smallest design that fits the existing boundaries, its effects on
public contracts and dependency direction, and any migration or compatibility
considerations. Identify the verification layer for each material acceptance
criterion and why it fits the risk: unit, integration, contract, end-to-end,
accessibility, security, migration/data integrity, or documentation validation.
For UI changes, use WCAG 2.2 AA as the default accessibility target and include
automated and manual checks appropriate to the affected journeys. Do not
require runtime tests for documentation-only changes. Distinguish documented
commands from checks that are unavailable or not applicable.
