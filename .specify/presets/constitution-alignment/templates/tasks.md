## Constitution-Aligned Verification Policy

This policy governs task generation and supersedes conflicting language in the
core command or template below about optional tests or mandatory test-first
development.

- Every behavior, contract, configuration, or data change MUST have explicit
  verification tasks appropriate to its acceptance criteria and risk.
- Choose the proving layer: unit tests for isolated logic; integration tests
  for module, service, and database behavior; contract tests for changed public
  interfaces; end-to-end tests for critical cross-layer journeys.
- Security-sensitive changes MUST include relevant security verification.
  Database or data changes MUST include migration validation, data-preservation
  checks, and recovery considerations proportionate to risk.
- UI changes MUST include relevant accessibility verification against WCAG 2.2
  AA by default, using automated checks and manual keyboard or screen-reader
  checks as appropriate. Changes without UI impact MUST NOT receive UI
  accessibility tasks.
- Documentation-only changes MUST include relevant documentation validation
  when available, but MUST NOT receive meaningless runtime test tasks.
- TDD is not mandatory unless explicitly required by the project Constitution
  or feature requirements.
- Use actual repository paths and documented commands. Trace verification
  tasks to acceptance criteria and describe a concrete observable result.
  Report relevant checks that cannot be run with their reason.

{CORE_TEMPLATE}
