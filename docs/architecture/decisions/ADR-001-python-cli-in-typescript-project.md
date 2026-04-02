---
id: ADR-001
title: Python CLI in a TypeScript monorepo
status: accepted
date: 2026-04-01
deciders: team
spec: spec_000001
---

# ADR-001: Python CLI in a TypeScript Monorepo

## Context

aloha-kids-game is a TypeScript/Tauri project. A canonical developer CLI was needed to encapsulate `init`, `test`, and `run` operations. The natural candidate languages were:

- **Shell script** (bash/zsh)
- **Node.js CLI** (TypeScript, via `ts-node` or compiled)
- **Python**

## Decision

Use Python 3.12 with stdlib only.

## Rationale

### The bootstrap problem rules out Node.js

The `init` command's job is to install Node.js and npm if they are missing. A Node.js CLI cannot run before Node.js is installed — circular dependency. This eliminates Node.js CLI as the entry point for `init`.

### Shell scripts are fragile cross-platform

Bash is unavailable on Windows without WSH/Git Bash. Detecting tools, printing coloured status lines, and handling errors cleanly requires non-trivial shell fu that degrades across zsh/bash/sh versions. Python gives us the same capability with a consistent, testable API.

### Python 3.12 is present on every supported platform

macOS ships Python 3 via Xcode Command Line Tools. Windows 10+ has the `py` launcher. Linux distributions ship Python 3 by default. Python 3.12 specifically is required for the `type Result[T]` alias syntax — a deliberate choice that keeps type annotations readable and modern.

### Python stdlib is sufficient and zero-dep

`argparse`, `subprocess`, `pathlib`, `shutil`, `dataclasses`, `unittest` cover all CLI needs. No `pip install` step. The CLI works immediately on any machine with Python 3.12+.

### Python is fully testable in isolation

All subprocess calls go through a single `runner.run_command` boundary, which is mockable via `unittest.mock.patch`. The 36-test suite runs in under 50ms with no real subprocesses spawned.

## Consequences

- Developers and CI machines must have Python 3.12+. The CLI exits with a clear message if the version requirement is not met.
- The CLI source lives in `ranzi_game/` (Python package) alongside the TypeScript source — a polyglot repo. This is a minor cognitive cost, justified by the bootstrap problem.
- Future CLI features should remain Python + stdlib to avoid adding a pip install step.

## Alternatives Rejected

| Option | Why rejected |
|--------|-------------|
| Node.js CLI | Cannot bootstrap itself — circular dependency on npm/node being present |
| Bash script | Cross-platform fragility; not unit-testable without bats/shunit2 |
| Makefile | Not cross-platform on Windows; no interactive prompts; poor error handling |
