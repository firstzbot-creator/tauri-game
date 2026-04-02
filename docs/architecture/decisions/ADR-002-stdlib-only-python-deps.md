---
id: ADR-002
title: stdlib-only Python dependencies for ranzi-game CLI
status: accepted
date: 2026-04-01
deciders: team
spec: spec_000001
---

# ADR-002: stdlib-only Python Dependencies

## Context

`ranzi-game.py` is the canonical developer CLI. It needs to run on a fresh machine as the very first step — before `npm install`, before any package manager is configured, before `pip` has been pointed at any package index. Any third-party Python dependency would require `pip install <package>` before the CLI could run, which reintroduces a manual bootstrap step.

## Decision

`ranzi-game.py` and the `ranzi_game/` package use **Python stdlib only**. No third-party packages. No `requirements.txt`. No `pyproject.toml`.

## Rationale

### Zero install step

A developer clones the repo and immediately runs:

```
python3 ranzi-game.py init
```

No `pip install -r requirements.txt` first. This is the intended experience.

### stdlib covers all needs

| Need | stdlib module |
|------|--------------|
| CLI argument parsing | `argparse` |
| Subprocess execution | `subprocess` |
| File system operations | `pathlib`, `shutil` |
| Structured data types | `dataclasses` |
| Unit testing | `unittest`, `unittest.mock` |
| System introspection | `sys` |

No third-party library offers a meaningful improvement over these for the CLI's current scope.

### Avoids version conflicts

Third-party packages can conflict with each other or with system Python packages. A stdlib-only CLI is immune to dependency resolution failures.

### Consistent with the bootstrap rationale in ADR-001

ADR-001 chose Python specifically because it avoids a pre-install step. Introducing a `pip install` requirement would undermine that decision.

## Consequences

- If a future CLI feature genuinely cannot be implemented with stdlib (e.g., a TOML config parser before Python 3.11, a rich terminal UI), revisit this ADR before adding deps.
- Python 3.11 added `tomllib` to stdlib. Python 3.12 added the `type` alias syntax. The 3.12 minimum (ADR-001) covers both.
- Third-party packages may be used in the TypeScript layer (`package.json`) without affecting this constraint — it applies only to `ranzi_game/`.

## Alternatives Rejected

| Option | Why rejected |
|--------|-------------|
| `click` for CLI | Requires `pip install click` before `init` can run |
| `rich` for terminal output | Same bootstrap problem; plain `print()` is sufficient |
| `pydantic` for config validation | Overkill for a developer-only CLI with no config file |
