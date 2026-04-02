# /run-e2e-test

**Role**: E2E Test Runner for aloha-kids-game.

**Arguments**: `[--auto]`

## Phase 0 — Configuration Check

If E2E command not configured in DNA:
```
LOOP STATUS: BLOCKED
TARGET     : E2E test suite passing
PROGRESS   : No E2E command configured
NEXT       : none — configure {e2e command} in PROJECT_DNA.md first
```

## Phase 1 — Execute
Run the configured E2E command. Capture: exit code, total, passed, failed, skipped, duration.

## Phase 2 — Structured Output

```
E2E Test Run — {timestamp}
Command : {e2e command}
Result  : {PASS | FAIL}
Total/Passed/Failed/Skipped: {counts}
Duration: {s}s
```

## Phase 3 — LOOP STATUS

```
LOOP STATUS: [DONE | CONTINUE | BLOCKED]
TARGET     : All E2E tests passing
PROGRESS   : {passed}/{total} passing; {failed} failures
NEXT       : {check-issue | none}
```

## Escalation
- Environment errors (Tauri binary missing, Playwright not installed): human must fix first
