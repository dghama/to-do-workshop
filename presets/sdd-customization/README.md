# SDD customization preset

Install this reusable preset from the repository root:

```powershell
specify preset add --dev .\presets\sdd-customization
```

The preset adds integration-neutral guidance to the Spec Kit Constitution,
Specify, Clarify, Plan, Tasks, Analyze, Implement, Checklist, and Converge
commands. The preset appends an optional use-case flow section to the core spec
template; the core retains its requirements and acceptance-criteria structure.
The composed feature specification continues to be generated in the resolved
feature's `spec.md`.

The template is named `spec-template.md` and adds use-case details without a
second output file. Its fields do not assume a Jira project, a fixed use-case
identifier, or a specific stakeholder role.

## Lifecycle responsibilities

| Phase | SDD customization | Separate responsibility |
| --- | --- | --- |
| Constitution | Keep updates about durable, evidence-based governance | Project-specific principles belong to the consuming repository |
| Specify | Elicit outcomes, use cases, and testable acceptance criteria | Repository quality policies and naming rules stay in their own presets |
| Clarify | Ask focused questions about material ambiguity and readiness | Decisions belong to the feature's stakeholders |
| Plan | Connect technical decisions to user outcomes and record trade-offs | Repository and Constitution checks remain in Constitution-alignment |
| Tasks | Order work around user-scenario priorities | Dependency and verification rules remain with the effective task template |
| Analyze | Separate product intent from technical decisions | The core analysis command remains read-only |
| Implement | Pause at unresolved product decisions and report deviations | Branching and lifecycle hooks remain with Git/Jira integrations |

Constitution-alignment remains responsible for repository-grounded quality
criteria and verification policy. Jira-branching remains responsible for Jira
issue naming and branch conventions. The Git extension remains responsible for
Git commands and lifecycle hooks. These are optional independent integrations;
this preset does not require or configure them.

## Source and generated artifacts

Maintain preset-owned instructions under this directory. Specify composes them
with the selected integration's core commands and renders them as skills when
that integration supports skills. Do not edit the installed copy or generated
skills directly.

The source preset is separate from the installed copy. To refresh after editing
this source, run:

```powershell
specify preset update sdd-customization --dev .\presets\sdd-customization
```

To migrate an existing installation of the former `spec-customization` preset,
remove that preset and install this one:

```powershell
specify preset remove spec-customization
specify preset add --dev .\presets\sdd-customization
```

Preset removal and update regenerate installed and integration artifacts.
Review the resolved command stack and generated skills after migration or a
Spec Kit upgrade. Removal preserves locally modified integration files; when
migrating from the former preset, check generated skills for its legacy
sections and remove only those reviewed sections. Do not force an integration
upgrade without reviewing all managed-file changes.
