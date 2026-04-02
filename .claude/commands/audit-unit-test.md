# /audit-unit-test

**Role**: Unit Test Quality Auditor for aloha-kids-game.

**Arguments**: `[--target N] [--auto]`

## Pre-conditions
- Load `.agent/DNA/PROJECT_DNA.md` — maturity level, test command, coverage command
- Load `docs/test-quality/test-quality-rules/core-rules.md` — existing rules baseline

## Phase 1 — Scope & Target
- Scope: unit tests only
- Target: LEARNING → 80% | ESTABLISHED → 85% | MATURE → 90%
- If coverage command not configured: output `LOOP STATUS: BLOCKED` and stop

## Phase 2 — Discovery
Discovery, risk triage, theater detection — scoped to unit test files.

## Phase 3 — Coverage Run
Run: `npx vitest run --coverage 2>&1 | tail -60`
Capture line% and branch% per module.

## Phase 4 — Write Audit Report
Write to `docs/test-quality/test-audit/latest-unit-test-audit.md`.

## Phase 5 — LOOP STATUS Output

```
LOOP STATUS: [CONTINUE | DONE | BLOCKED]
TARGET     : Unit test coverage >= {target}% across all modules
PROGRESS   : {N}/{total} modules at target; overall {pct}%
NEXT       : {handle-test-audit --auto | none}
```

With `--auto` and CONTINUE: execute `handle-test-audit --auto`.
