"""Validate the SDD preset manifest and its referenced source files."""

from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
PRESET_DIR = ROOT / "presets" / "sdd-customization"
MANIFEST_PATH = PRESET_DIR / "preset.yml"


def fail(message):
    raise SystemExit("SDD preset validation failed: " + message)


def main():
    with MANIFEST_PATH.open(encoding="utf-8") as manifest_file:
        manifest = yaml.safe_load(manifest_file)

    preset = manifest.get("preset") if isinstance(manifest, dict) else None
    if not isinstance(preset, dict) or preset.get("id") != "sdd-customization":
        fail("preset metadata is missing or has an unexpected id")

    provides = manifest.get("provides")
    if not isinstance(provides, dict):
        fail("provides must be a mapping")

    contributions = provides.get("templates")
    if not isinstance(contributions, list):
        fail("provides.templates must be a list")

    expected_sources = {
        ("template", "spec-template"): {"templates/spec-template.md"},
        ("template", "plan-template"): {"templates/plan-template.md"},
        ("command", "speckit.constitution"): {"commands/constitution.md"},
        ("command", "speckit.specify"): {"commands/specify.md"},
        ("command", "speckit.clarify"): {"commands/clarify.md"},
        ("command", "speckit.plan"): {"commands/plan.md"},
        ("command", "speckit.tasks"): {"commands/tasks.md"},
        ("command", "speckit.analyze"): {"commands/analyze.md"},
        ("command", "speckit.implement"): {"commands/implement.md"},
        ("command", "speckit.checklist"): {"commands/feature-context.md"},
        ("command", "speckit.converge"): {"commands/feature-context.md"},
    }
    required_strategies = {"template": "append", "command": "prepend"}
    found_sources = {key: set() for key in expected_sources}
    common_context_targets = set()

    for contribution in contributions:
        if not isinstance(contribution, dict):
            fail("each contribution must be a mapping")

        kind = contribution.get("type")
        name = contribution.get("name")
        strategy = contribution.get("strategy")
        relative_path = contribution.get("file")
        if not all(
            isinstance(value, str) and value
            for value in (kind, name, strategy, relative_path)
        ):
            fail("each contribution needs non-empty type, name, strategy, and file fields")
        if strategy not in {"append", "prepend", "wrap"}:
            fail("unsupported strategy " + repr(strategy) + " for " + name)

        source_path = (PRESET_DIR / relative_path).resolve()
        try:
            source_path.relative_to(PRESET_DIR.resolve())
        except ValueError:
            fail("contribution path escapes the preset directory: " + relative_path)
        if not source_path.is_file():
            fail("contribution file does not exist: " + relative_path)

        expected_source_set = expected_sources.get((kind, name))
        if expected_source_set is not None and relative_path not in expected_source_set:
            fail(
                name
                + " cannot reference "
                + relative_path
                + "; expected "
                + ", ".join(sorted(expected_source_set))
            )
        if kind in required_strategies and strategy != required_strategies[kind]:
            fail("unexpected strategy for " + name + ": " + strategy)

        if (kind, name) in found_sources:
            found_sources[(kind, name)].add(relative_path)
        if relative_path == "commands/feature-context.md":
            common_context_targets.add(name)

    missing = [
        (kind, name, source)
        for (kind, name), sources in expected_sources.items()
        for source in sorted(sources - found_sources[(kind, name)])
    ]
    if missing:
        fail("missing required contribution(s): " + ", ".join(map(str, missing)))

    expected_context_targets = {
        "speckit.checklist",
        "speckit.converge",
    }
    if common_context_targets != expected_context_targets:
        fail("feature-context.md must be registered for Checklist and Converge")

    print(
        "SDD preset validation passed: "
        + str(len(contributions))
        + " contributions reference existing source files."
    )


if __name__ == "__main__":
    main()
