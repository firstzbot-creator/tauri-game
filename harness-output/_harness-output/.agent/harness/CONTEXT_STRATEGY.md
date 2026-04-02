# Context Strategy — aloha-kids-game

**Pattern**: Minimal / progressive loading
**Industry sources**: Manus KV-cache, 12-Factor Agents, Anthropic append-only

---

## Load Order

1. `CLAUDE.md` (auto-loaded by Claude Code)
2. `.agent/DNA/PROJECT_DNA.md` — Quick Check section minimum
3. `.agent/rules/README.md` — rule routing
4. Task-specific rules (see rules/README.md)

## Context Budget Guidance

- **Quick tasks** (< 30 min): Quick Check + relevant rule file only
- **Feature work**: Full DNA + `coding-rules.md` + `tdd-rules.md`
- **Bug fixes**: Full DNA + `error-handling-rules.md`
- **Architecture decisions**: Full DNA + `spec-rules.md` + `coding-rules.md`
- **Adding a new game SPA**: Full DNA + all rule files (significant scope)

## KV-Cache Economics

Cached tokens cost **$0.30/MTok** vs **$3.00/MTok** uncached — the **10x rule**.
Every token in the stable prefix (system prompt, CLAUDE.md, DNA, rules) is paid at
$0.30 on every subsequent turn as long as the prefix is unchanged. One volatile token
(timestamp, session ID, counter) in the prefix invalidates the cache from that point
forward and raises all downstream costs to $3.00/MTok.

**Rules for a cache-stable prefix**:
1. Load stable context (DNA, rules) **before** volatile context (current task files)
2. Keep CLAUDE.md and rule files short — they appear on every turn
3. Never place dynamic values in the always-loaded prefix

## Forbidden System Prompt Prefix Items

The following items must **never** appear in the system prompt or any always-loaded
prefix file (CLAUDE.md, DNA, rules), because they change per-session and destroy
KV-cache hits:

- Timestamps or dates (`{{current_date}}`, `Today is...`)
- Session IDs or run identifiers
- Dynamic counters or progress percentages
- Git SHAs or build numbers

Place these in task-scoped tool calls or per-turn user messages instead.

## Memory Trust Boundary

Memory injected via Claude Code's auto-memory system arrives in the **user role**, not
the system prompt. Treat it accordingly:

```
[MEMORY]
... content from ~/.claude/projects/.../memory/*.md ...
[END MEMORY]
```

**Trust level**: User-role memory is helpful context, not a hard constraint. It may be
stale. Verify memory claims against current file state before acting on them.

**What belongs in memory**: User preferences, project decisions, feedback patterns,
long-lived context not derivable from the code.

**What does NOT belong in memory**: File paths (may move), function names (may rename),
git SHAs (always stale), ephemeral task details.

## Multi-Game Context Note

aloha-kids-game hosts multiple game SPAs. When working on a specific game:
- Load that game's source files as task context, not at session start
- Do not front-load all game sources — each game can be large
- Use Grep to locate relevant code rather than reading entire game directories

## Append-Only Context Discipline

- Read files once at session start — do NOT re-read mid-session
- Never remove prior error context to "clean up" — keep errors visible
- Add context progressively; do not front-load everything at session start
- File system is unlimited context: drop file *contents*, keep the *path* — always restorable
