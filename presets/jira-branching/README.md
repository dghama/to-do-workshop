# Jira feature branching preset

This preset composes with the standard Spec Kit commands and the Git extension.
Install it from the repository root:

```powershell
specify preset add --dev .\presets\jira-branching
```

Invoke `/speckit-specify` with a Jira issue key and a feature description,
for example `PROJ-123 Add user authentication`. The workflow lowercases the
Jira key, derives a one-to-five-word lowercase ASCII slug, and uses the same
name in `feature/proj-123-user-auth` for the Git branch and
`specs/proj-123-user-auth` for the specification directory. Accents are
removed from the slug. Without a Jira key, the normal Spec Kit numbering
behavior remains in effect.

The Git extension must be installed and its `before_specify` hook enabled.
The usual `.specify/feature.json` pointer identifies the spec for downstream
commands; it is local checkout state, so select the intended feature when
switching branches or worktrees.

The source preset is maintained here, separately from generated commands.
Spec Kit copies it during installation and materializes composed skills; edits
to this source do not automatically update the installed copy. To refresh after
editing the preset, run:

```powershell
specify preset update jira-branching --dev .\presets\jira-branching
```

`preset update` removes the installed copy before reinstalling, so back up any
local changes to that copy and check the source first. After upgrading or
reinitializing Spec Kit, inspect the effective skill and run the update command
if it needs to be regenerated. Composition reduces direct conflicts with
upstream command changes, but cannot guarantee compatibility with every future
release.
