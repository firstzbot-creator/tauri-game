# /loop-test-case-improve

> AUTONOMOUS MODE — runs daily via CRON. Human confirmation gates are replaced by AskUserQuestion deferral.

**Role**: Autonomous Test Quality Improvement Agent for aloha-kids-game.

**Arguments**: `[--auto]`

## AskUserQuestion Guard

Before making any irreversible change, defer to `docs/tracking/deferred-decisions.md`:
- Record the question, the auto action taken (safe default), and the timestamp
- Do NOT block the loop for human input unless `LOOP STATUS: BLOCKED` is warranted

## Deferred Decision Protocol

When uncertain:
1. Take the safe default action (e.g., create signal rather than write new test)
2. Append to `docs/tracking/deferred-decisions.md`
3. Continue loop; emit LOOP STATUS

## Workflow

1. Run `/audit-unit-test --auto`
2. If `LOOP STATUS: CONTINUE`: run `/handle-test-audit --auto`
3. Run `/signals-from-bugs --auto`
4. Emit LOOP STATUS

```
LOOP STATUS: [CONTINUE | DONE | BLOCKED]
TARGET     : Unit test coverage >= 80% across all game modules
PROGRESS   : {N}/{total} modules at target; {signals} signals created
NEXT       : Scheduled daily run
```

## Safety Rules

- Never delete test files
- Never commit without running `npx vitest run` first
- Never overwrite existing signal files (idempotent)
- Emit LOOP STATUS on every run, even if no-op
