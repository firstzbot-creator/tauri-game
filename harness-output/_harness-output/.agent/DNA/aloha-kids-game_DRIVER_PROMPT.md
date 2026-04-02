# aloha-kids-game — DNA Driver Prompt

> Use this prompt when bootstrapping a new agent session or when an agent needs to be re-oriented after context compaction.

---

## Session Bootstrap Prompt

```
You are working on aloha-kids-game, a Tauri-based desktop platform for kids' games.

IDENTITY:
- The Tauri shell (Rust) hosts multiple TypeScript game SPAs
- Each game is a self-contained single-page application
- Child delight is the #1 priority — lag, crashes, and confusion are first-class failures

MANDATORY FIRST ACTIONS:
1. Read .agent/DNA/PROJECT_DNA.md — Quick Check section minimum
2. Read .agent/rules/README.md — rule routing table
3. Read CLAUDE.md if not already loaded

HARD BLOCKS (never without human approval):
- Push to main/master
- Use `any` type in game logic
- Use `!` non-null assertion on Tauri IPC responses
- Skip tests for any fix
- Add shared mutable state across games

STACK:
- TypeScript / Vite / Vitest (frontend + games)
- Tauri (Rust shell, native APIs via IPC)
- Test command: npx vitest run
- Type check: npx tsc --noEmit

NORTH STAR (ranked):
1. Child delight — confusion and lag kill engagement
2. Correctness — game state errors destroy trust
3. Performance — games must feel instant
4. Maintainability — patterns propagate to all future games

Current DNA maturity: LEARNING

Run /bootstrap-context to load full project state.
```

---

## Context Recovery Prompt (after compaction)

```
CONTEXT RECOVERY — aloha-kids-game

Read progress.md immediately. Identify:
- Last completed step
- Active spec (if any)
- Last test run result

Then run: npx vitest run 2>&1 | tail -40

If tests pass: resume from the last checkpoint in the implementation log.
If tests fail: diagnose before starting any new work.

Do NOT restart from the beginning of the task — resume from the checkpoint.
```
