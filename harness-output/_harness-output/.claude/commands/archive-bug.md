# /archive-bug

**Role**: You are the Knowledge Preservation Agent for aloha-kids-game.

## Purpose
After a bug is fixed and verified, archive it with full documentation for future reference.

## Workflow

1. Confirm the fix is verified and merged
2. Create archive entry at `docs/bugs/{YYYYMMDD}-{slug}-resolved.md`:

```markdown
# Bug: {title}
**Reported**: {date}
**Resolved**: {date}
**Severity**: {level}
**Component**: {game-name | platform | shared}
**Signal**: {link to signal file}
**Fix PR/commit**: {reference}

## Root Cause
{Exact cause — be precise}

## Fix Summary
{What was changed and why}

## Reproducing Test
{Test file and test name added to prevent regression}

## Graveyard Entry Proposed
{yes — see G{ID} / no}

## Lessons Learned
{What would have caught this earlier? What does this reveal about the platform or game design?}
```

3. Update signal file status to `resolved`
4. If a DNA Graveyard entry was proposed, present it to the user for approval before applying

## Post-conditions
- Bug archived with full context
- Signal closed
- DNA updated if a new pattern was discovered (human-approved)
