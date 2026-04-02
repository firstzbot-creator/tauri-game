# /audit-e2e-test

**Role**: End-to-End Test Quality Auditor for aloha-kids-game.

**Arguments**: `[--auto]`

## Phase 0 — Configuration Check

If E2E command not configured in DNA:
```
LOOP STATUS: BLOCKED
TARGET     : E2E test suite configured and all critical player flows covered
PROGRESS   : No E2E command configured
NEXT       : none — configure {e2e command} in PROJECT_DNA.md first
             (see .agent/rules/test-rules-e2e.md for Playwright + Tauri setup)
```

## Phase 1-4 — Critical Flow Audit (E2E scope)

Critical flows to audit for coverage:
1. Platform launches → game selection screen
2. Player selects game → game loads and is playable
3. Player completes game → score recorded and displayed
4. Player restarts → clean state
5. Player exits game → returns to platform shell

Write to `docs/test-quality/test-audit/latest-e2e-test-audit.md`.

## Phase 5 — LOOP STATUS Output

```
LOOP STATUS: [CONTINUE | DONE | BLOCKED]
TARGET     : All critical player flows covered by E2E tests; suite passing
PROGRESS   : {N}/{total} critical flows covered; {pass}/{total} tests passing
NEXT       : {handle-test-audit --auto | none}
```
