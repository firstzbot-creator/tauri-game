# Progressive Disclosure — aloha-kids-game

**Pattern**: 3-layer context loading to avoid front-loading
**Industry sources**: Honra.io 3-layer, Cursor semantic search, Anthropic JIT loading

---

## The Three Layers

### Layer 1 — Always Loaded (~500 tokens)
Stable prefix; loaded at every session start.

- `CLAUDE.md` — auto-loaded by Claude Code
- `.agent/DNA/PROJECT_DNA.md` — Quick Check section only
- `.agent/rules/README.md` — rule routing table

**Do not add anything to Layer 1 without a strong reason** — every token here costs on every turn.

### Layer 2 — Task-Specific (load on demand)
Load the relevant rule file when starting a task.

| Task | Load |
|------|------|
| Write game or platform code | `coding-rules.md` |
| Write tests | `tdd-rules.md` + tier file |
| Create or review spec | `spec-rules.md` |
| Debug or handle errors | `error-handling-rules.md` |
| Add a new game | `coding-rules.md` + `tdd-rules.md` + `spec-rules.md` |

### Layer 3 — Deep Dive (read individual files)
Load specific source files, specs, or architecture docs only when they are directly relevant to the current task. Use Grep to locate the relevant section rather than reading entire files.

| Need | Tool | Notes |
|------|------|-------|
| Find a function definition | Grep | Read only the target range, not the whole file |
| Understand a game's structure | Glob + Read | Read one file at a time, not the full game directory |
| Review a spec | Read (target spec only) | Do not load all specs |
| Check architecture decisions | Read (target ADR only) | |

---

## Anti-Patterns (avoid these)

| Anti-Pattern | Why it hurts |
|-------------|-------------|
| Reading all game source files at session start | Context overload; "lost in the middle" degradation |
| Loading all rule files for every task | Wastes tokens and KV-cache on irrelevant rules |
| Re-reading files already loaded this session | Duplicates context; doesn't refresh state mid-session |
| Loading `docs/specs/` entirely to find one spec | Use Grep to find the spec file first |

---

## Multi-Game Isolation Rule

When working on Game A, do **not** load Game B's source files even if they seem related.
Each game is a self-contained SPA — cross-game context is almost always misleading.
Use `packages/shared/` as the only legitimate cross-game reading point.

---

## Compaction Trigger

If context usage exceeds 80% of the window:
1. Write a checkpoint to `progress.md`
2. Summarize completed steps in one paragraph
3. Start a fresh session and load from the checkpoint
4. Do NOT truncate error history — errors are context
