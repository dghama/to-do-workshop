## Customized specification is authoritative

Before any hook, prerequisite, or setup step below, run
`.\scripts\resolve-feature-context.ps1` from the repository root and check its
exit status. Stop on failure; never use an old `.specify/feature.json`.
On a branch that does not match `feature/<JIRA-ID>-<short-name>`, ask the user
to select an existing `specs/<JIRA-ID>-<short-name>` directory explicitly,
then run the resolver with `-FeatureDirectory` and the selected value. A
previous pointer or environment variable is not an explicit selection. Do not
silently override conflicting `SPECIFY_FEATURE_DIRECTORY` or `SPECIFY_FEATURE`
environment variables; tell the user to clear or correct them. Run the
resolver again if the branch or selection changes before a subsequent command.
This is an agent instruction; direct script calls do not automatically run it.

After resolving `FEATURE_DIR` and before using feature requirements, read
`FEATURE_DIR/spec.md` as the authoritative specification. Use the specification's goal, flows,
preconditions, postconditions, business rules, scope, and open questions.
Organize work around the evidenced goal and flows; distinguish derived
technical work from Product Owner decisions. Report unresolved questions and
never present unsupported assumptions as approved requirements. Respect Out of
Scope.
The standard constitution, plan, task, checklist, and hook rules still apply.
Do not modify the specification during read-only commands.

On Windows, if `python3` is an unusable Microsoft Store alias, find a working
Python 3 executable with PyYAML and set `SPECKIT_PYTHON_EXECUTABLE` in each
process running a Spec Kit resolver or setup script. Report missing Python or
PyYAML instead of bypassing template composition.
