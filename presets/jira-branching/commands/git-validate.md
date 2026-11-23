## Jira feature branch validation

Before applying the standard validation below, inspect the current Git branch
(or `SPECIFY_FEATURE` when Git is unavailable). If it matches
`feature/<key>-<short-name>`, where `<key>` is a lowercase Jira project key
followed by a hyphen and digits, and `<short-name>` is one to five lowercase
ASCII words separated by hyphens:

- Report that the branch is valid.
- Check for `specs/<key>-<short-name>` and report whether it exists.
- Stop; do not apply the numeric/timestamp validation below to this branch.

For all other branch names, apply the standard validation below unchanged.
