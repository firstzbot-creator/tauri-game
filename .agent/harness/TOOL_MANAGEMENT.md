# Tool Management — aloha-kids-game

**Pattern**: Tool count discipline, consistent naming, dynamic availability
**Industry sources**: Vercel tool reduction, Manus action masking

---

## Tool Count Targets

Keep active tools below 15 per workflow phase (Vercel's finding: accuracy degrades above 15).

| Phase | Recommended tools | Tools to avoid |
|-------|------------------|----------------|
| Discovery / reading | Read, Grep, Glob | Write, Edit, Bash |
| Test writing | Read, Write, Bash (`npx vitest run`) | — |
| Implementation | Read, Write, Edit, Bash | — |
| Review / audit | Read, Grep, Bash | Edit, Write |
| Bug fix | Read, Grep, Edit, Bash | Write (new files) |

---

## Naming Conventions

Use verb-noun naming for all tool outputs and artifact files:

| Good | Bad |
|------|-----|
| `spec_000001_game-launcher.md` | `game_launcher_spec.md` |
| `B000001_score-not-saving.md` | `score_bug.md` |
| `2026-04-01-tauri-ipc-gap.md` | `tauri_problem.md` |

---

## Tauri + TypeScript Tool Stack

Primary tools for this project:

| Tool | Use |
|------|-----|
| `npx vitest run` | Unit + integration tests |
| `npx vitest run --coverage` | Coverage report |
| `npx tsc --noEmit` | Type checking without build |
| `npx tauri dev` | Dev server (long-running) |
| `npx tauri build` | Release build |

Secondary tools (use only when needed):
- `npx eslint src/` — linting
- `npx prettier --check .` — formatting check

---

## Serialization Variation (Manus Principle)

Avoid repeating the exact same tool call sequence more than twice in a row.
If Grep → Read → Edit → Grep yields no progress after 2 cycles:
- Vary the search pattern
- Try a different starting file
- Ask the human rather than retrying the same sequence

This prevents few-shot traps where the agent locks into a non-productive pattern.

---

## Tool Hygiene Rules

| Rule | Why |
|------|-----|
| One Bash call per operation — do not chain unrelated commands | Hard to debug when chained commands fail |
| Always capture exit code from Bash — treat non-zero as an error | Silent failures in bash chains hide real problems |
| Use Grep before Read when searching for content | Grep is faster and avoids loading large files |
| Never use `find` when Glob works | Glob is the preferred file discovery tool |
| Close file reads after extracting the needed information | Prevents unnecessary context growth |
