# /loop-house-clean

> AUTONOMOUS MODE — runs weekly via CRON. Human confirmation gates are replaced by AskUserQuestion deferral.

**Role**: Autonomous Housekeeping Agent for aloha-kids-game.

**Arguments**: `[--auto]`

## AskUserQuestion Guard

Before archiving a spec: verify status is `completed`. If not completed, defer.
Before any DNA update: always defer to human — never self-apply Canon or Graveyard entries.

## Deferred Decision Protocol

When uncertain about which action to take, record in `docs/tracking/deferred-decisions.md` and take the safe default (no-op).

## Workflow

1. **Spec house-clean**: Count completed specs in `docs/specs/`
   - If > 5 completed: suggest `/spec-archive` (do not auto-archive — requires human confirmation)
   - If > 14 days since last archive: note in deferred-decisions

2. **Signal cleanup**: Run `/signals-from-bugs --auto`

3. **Deferred-decisions archival**: Check `docs/tracking/deferred-decisions.md`
   - Archive resolved entries older than 7 days to `docs/tracking/archive/deferred-decisions-resolved-{YYYYMMDD}.md`
   - Keep active file under 200 entries

4. Emit LOOP STATUS

```
LOOP STATUS: [CONTINUE | DONE | BLOCKED]
TARGET     : Spec directory lean; signals processed; deferred-decisions under 200 entries
PROGRESS   : {completed-specs} completed specs; {signals-created} signals; {entries} deferred entries
NEXT       : Scheduled weekly run
```

## Safety Rules

- Never delete spec files — only archive via git mv
- Never auto-apply DNA updates
- Emit LOOP STATUS on every run
