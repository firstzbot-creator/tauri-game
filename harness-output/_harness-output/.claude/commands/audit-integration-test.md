# /audit-integration-test

**Role**: Integration Test Quality Auditor for aloha-kids-game.

**Arguments**: `[--target N] [--auto]`

## Pre-conditions
- Load `.agent/DNA/PROJECT_DNA.md` — maturity level, coverage command
- Load `docs/test-quality/test-quality-rules/core-rules.md`

## Phase 1 — Scope & Target
- Scope: integration tests only (Tauri IPC boundary, game↔platform events)
- Target: LEARNING → 70% | ESTABLISHED → 70% | MATURE → 60%

## Phase 2 — Discovery
Discovery, risk triage, theater detection — scoped to integration test files.

## Phase 3 — Coverage Run
Run `npx vitest run --coverage` for integration paths.

## Phase 4 — Write Audit Report
Write to `docs/test-quality/test-audit/latest-integration-test-audit.md`.

## Phase 5 — LOOP STATUS Output

```
LOOP STATUS: [CONTINUE | DONE | BLOCKED]
TARGET     : Integration test coverage >= {target}% across cross-component paths
PROGRESS   : {N}/{total} modules at target; overall {pct}%
NEXT       : {handle-test-audit --auto | none}
```
