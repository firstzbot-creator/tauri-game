# Loop Automation Protocol — aloha-kids-game

This document defines the conventions for CRON-driven autonomous workflows in this project.
All loop commands (`loop-*.md`) follow the rules below.

## Loop command catalog

| Command | Interval | Scope |
|---------|----------|-------|
| `loop-test-case-improve` | daily | Test quality audits |
| `loop-mutation-test` | weekly | Mutation testing |
| `loop-feature-pipeline` | daily | Spec → implementation |
| `loop-house-clean` | weekly | Signal capture + harness maintenance |
| `auto-memory-hygiene` | daily | Memory pruning |

Customize intervals per project: edit the CronCreate call inside each loop command file.

## Interval recommendations

| Cadence | Recommended for |
|---------|----------------|
| hourly | CI smoke checks only (high overhead) |
| daily | Test audits, feature pipeline, memory hygiene |
| weekly | Mutation testing, full housekeeping, harness audit |
| on-demand | Regression checks, release pipeline |

## LOOP STATUS format

Every loop command must emit a LOOP STATUS block on completion:

```
LOOP STATUS: {CONTINUE|DONE|BLOCKED|ERROR}
TARGET: {what the loop is working toward}
PROGRESS: {measurable progress since last run}
NEXT: {what will happen on the next scheduled run}
```

**Status values**:

| Status | Meaning |
|--------|---------|
| `CONTINUE` | Work in progress; schedule next run |
| `DONE` | Goal reached; loop may be paused or removed |
| `BLOCKED` | Cannot proceed; human review needed |
| `ERROR` | A command failed; check logs |

A machine reading LOOP STATUS must detect these values by exact string match on `LOOP STATUS: `.

## Loop safety rules

1. **Never delete** files in a loop command without explicit user confirmation (or `--auto` deferral).
2. **Never commit** without running `npx vitest run` first.
3. **Always emit** LOOP STATUS — even if the run was a no-op.
4. **Idempotent**: running a loop command twice in a row must produce the same result.
5. **Defer uncertainty**: use `docs/tracking/deferred-decisions.md` for all ambiguous decisions.
