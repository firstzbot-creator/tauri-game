# /loop-feature-pipeline

> AUTONOMOUS MODE — runs daily via CRON. Human confirmation gates are replaced by AskUserQuestion deferral.

**Role**: Autonomous Feature Pipeline Agent for aloha-kids-game.

**Arguments**: `[--auto]`

## AskUserQuestion Guard

Before starting implementation of any spec, check that status is `approved`.
If a spec is `draft`, defer: "Spec {ID} is still in draft — cannot implement without human approval."

## Deferred Decision Protocol

When uncertain about priority among multiple approved specs:
- Choose the spec with the oldest "approved" date (FIFO)
- Record the choice in `docs/tracking/deferred-decisions.md`

## Workflow

1. Read `docs/tracking/spec-index.md` — find specs with status `approved`
2. If none: emit `LOOP STATUS: DONE`
3. Select highest-priority approved spec
4. Run `/spec-implement` for the selected spec
5. Run `/audit-unit-test --auto` after implementation
6. Emit LOOP STATUS

```
LOOP STATUS: [CONTINUE | DONE | BLOCKED]
TARGET     : All approved specs implemented with passing tests
PROGRESS   : {spec-ID} implemented; {remaining} approved specs remaining
NEXT       : Scheduled daily run
```

## Safety Rules

- Never implement a spec in `draft` status — LOOP STATUS: BLOCKED
- Never skip TDD cycle — write failing test before production code
- Emit LOOP STATUS on every run
