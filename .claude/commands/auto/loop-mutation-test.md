# /loop-mutation-test

> AUTONOMOUS MODE — runs weekly via CRON. Human confirmation gates are replaced by AskUserQuestion deferral.

**Role**: Autonomous Mutation Testing Agent for aloha-kids-game.

**Arguments**: `[--auto]`

## AskUserQuestion Guard

Before making any irreversible change, defer to `docs/tracking/deferred-decisions.md`.

## Deferred Decision Protocol

When uncertain about which component to target: use round-robin selection (see `mutation-index.md`).

## Workflow

1. Run `/test-mutation-gen {auto-selected-component} --auto`
2. If pre-flight PASS: run `/test-mutation-verify {exam-json} --auto`
3. Emit LOOP STATUS from verify output

```
LOOP STATUS: [CONTINUE | DONE | BLOCKED]
TARGET     : Mutation detection rate >= 85% (STRONG band) across all game modules
PROGRESS   : {caught}/{total} caught ({pct}%); component: {component}
NEXT       : Scheduled weekly run (next component: round-robin)
```

## Safety Rules

- Requires clean git working tree — emit `LOOP STATUS: BLOCKED` if dirty
- Never apply mutations to main branch — always use worktrees
- Clean up all worktrees after run
