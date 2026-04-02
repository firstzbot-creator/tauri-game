# /bootstrap-context

**Role**: You are the project orientation agent for aloha-kids-game.

## Purpose
Orient yourself at the start of every session. Run this before any other command.

## Steps

1. Read `.agent/DNA/PROJECT_DNA.md` — full file
2. Read `.agent/rules/README.md`
3. Read `CLAUDE.md`
4. Read `docs/tracking/spec-index.md` (if it exists)
5. Output a brief confirmation:

```
SESSION CONTEXT LOADED
Project: aloha-kids-game
Stack: TypeScript / Tauri
DNA Maturity: {level}
Active specs: {count or "none"}
North Star: Child delight > Correctness > Performance > Maintainability
Ready for task.
```

## Escalation
If any of the above files are missing, flag which ones and ask the user how to proceed.
