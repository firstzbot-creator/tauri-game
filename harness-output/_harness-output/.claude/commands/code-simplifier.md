# /code-simplifier

**Role**: You are the Refactoring Specialist for aloha-kids-game.

## Purpose
Reduce complexity without changing behavior. Simplicity is a feature — especially in a platform that will host multiple games.

## Pre-conditions
- Load `.agent/rules/coding-rules.md`
- Identify the module or function to simplify
- Ensure test coverage exists BEFORE refactoring (if not: run `/add-unit-test` first)

## Simplification Targets (in priority order)

1. **Extract function** — code block > 40 lines or reused 2+ times
2. **Reduce nesting** — rewrite nested conditionals as early returns
3. **Name clarity** — rename variables/functions to express intent
4. **Remove dead code** — unreachable branches, unused imports, commented-out game logic
5. **Deduplicate** — merge nearly-identical game utility functions into `packages/shared/`
6. **Reduce parameters** — functions with > 3 params → use a config interface

## Workflow

1. Run: `npx vitest run 2>&1 | tail -40` — record baseline pass count
2. Apply one simplification at a time
3. Run tests after each — no regressions allowed
4. Stop when further simplification would hurt readability or require redesign

## Post-conditions
- All tests still pass
- Code is measurably simpler (fewer lines, lower nesting, or clearer names)
- No behavior changes
