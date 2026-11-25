## Repository-grounded planning

Before choosing an approach, inspect the actual repository: relevant module
boundaries and exports, existing implementations, package/configuration files,
architecture and development documentation, test conventions, and documented
quality gates. Load `.specify/memory/constitution.md` when present. Do not
assume a stack, path, test runner, dependency, deployment target, or capability
that repository evidence does not support.

Use the plan template's repository-alignment section to record concrete paths
and evidence, affected modules and public contracts, dependency direction, and
the smallest compatible design. Evaluate the design against each applicable
Constitution requirement before and after design; surface violations rather
than diluting requirements. Complete the template's verification strategy
using repository evidence, cite exact existing commands when discoverable, and
distinguish unavailable checks from checks that will be run.
