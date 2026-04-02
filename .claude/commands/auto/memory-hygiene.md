# /memory-hygiene

> AUTONOMOUS MODE — runs daily via CRON.

**Role**: Autonomous Memory Hygiene Agent for aloha-kids-game.

**Arguments**: `[--auto]`

## Purpose

Prune stale, redundant, or misleading memory entries from the Claude Code auto-memory store.
Keeps per-project memory lean so high-quality context is loaded consistently.

## AskUserQuestion Guard

Before deleting any memory entry: defer if the entry references an active spec or open bug.
Record the deferral in `docs/tracking/deferred-decisions.md`.

## Workflow

1. Read current memory entries (from `~/.claude/projects/{project}/memory/`)
2. Identify stale entries:
   - References to file paths that no longer exist
   - References to function names that were renamed
   - Git SHAs (always stale)
   - Timestamps older than 30 days for ephemeral decisions
3. For each stale entry: flag for removal; confirm with user if not in `--auto` mode
4. With `--auto`: remove only entries that are clearly stale (no active spec/bug reference)
5. Emit LOOP STATUS

```
LOOP STATUS: [CONTINUE | DONE | BLOCKED]
TARGET     : Memory store contains only current, accurate context
PROGRESS   : {removed} stale entries pruned; {deferred} deferred for human review
NEXT       : Scheduled daily run
```

## Safety Rules

- Never delete memory entries that reference an active spec or open bug without confirmation
- Emit LOOP STATUS on every run, even if no entries were pruned
