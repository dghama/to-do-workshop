# Specification customization preset

Install this preset alongside the Jira branching preset from the repository root:

```powershell
specify preset add --dev .\presets\spec-customization
```

`/speckit-specify PROJ-123 Add user authentication` creates
`specs/proj-123-user-auth/spec.md` directly. With the Jira branching preset installed, the branch is
`feature/proj-123-user-auth`. Keep the same lowercase ASCII slug, with at most
five hyphen-separated words and no accents, in the branch and feature directory.

The feature `spec.md` is the authoritative specification. Planning,
clarification, tasks, analysis, checklists, implementation, and convergence read
and update that file directly. Unsupported assumptions belong in Open Questions
for the Product Owner. New specifications are Draft; approval is explicit and
requires an empty Open Questions section.
Use `/speckit-clarify` for standalone clarification of an existing feature.
To incorporate a new Jira story into an existing specification, explicitly ask
`/speckit-specify` to update that file in place. The specify workflow still
executes its mandatory branch hook using the current story's Jira key and
short name, then verifies the branch and existing `spec.md` before writing.
It preserves the existing specification ID, item IDs, and feature directory;
new items continue the existing numbering. Missing or failed mandatory hooks
and branch or specification mismatches stop the update rather than allowing
edits on `main`. Clarification questions stay within the specify lifecycle,
including its validation and post-hooks.

Before feature-scoped commands, the agent runs
`.\scripts\resolve-feature-context.ps1`. On a branch such as
`feature/proj-123-user-auth`, it verifies `specs/proj-123-user-auth/spec.md`
and updates the checkout-local `.specify/feature.json`. It stops on missing
paths or conflicting `SPECIFY_FEATURE_DIRECTORY` / `SPECIFY_FEATURE` values.
Clear those variables if they refer to a different feature. The resolver also
stops when `SPECIFY_FEATURE_NO_PERSIST` is enabled rather than writing state.

On app-managed or other nonmatching branches, select a feature explicitly:

```powershell
.\scripts\resolve-feature-context.ps1 -FeatureDirectory 'specs/proj-123-user-auth'
```

The agent must ask for that selection when running a feature-scoped command.
The resolver does not run on checkout, for `/speckit-specify` when creating a
new feature, or for direct calls to Spec Kit scripts. Direct callers must run
it themselves first. Avoid running commands for different features at the
same time in one checkout because they share `feature.json`.

The standard PowerShell template resolver requires Python 3 and PyYAML. If
Windows resolves `python3` to a nonfunctional Microsoft Store alias, set
`$env:SPECKIT_PYTHON_EXECUTABLE` to the path of a working Python executable
with PyYAML in the process running the resolver or setup script.

The source preset is separate from generated skills and the installed copy.
After editing it, regenerate with:

```powershell
specify preset update spec-customization --dev .\presets\spec-customization
```

The update command removes the installed preset before reinstalling, so check
the source and back up any edits to the installed copy first. After a Spec Kit
upgrade or reinitialization, inspect the generated skills and regenerate if
necessary. Composition reduces conflicts but does not guarantee future
compatibility. These are agent instructions, not a programmatic enforcement
mechanism; review generated artifacts before approval.
