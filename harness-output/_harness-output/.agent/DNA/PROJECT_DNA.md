# PROJECT_DNA: aloha-kids-game

**Maturity**: LEARNING
**Last reviewed**: 2026-04-01
**Owner**: team

---

## Quick Check *(agents scan this first for any task)*

```
Stack:    TypeScript / Tauri (Rust shell) / Vite / Vitest
Arch:     Multi-game platform — Tauri desktop shell hosts multiple SPA games; each game is a
          self-contained TypeScript single-page app rendered in the Tauri browser engine
Priority: Delight > Correctness > Performance > Maintainability
Load:     TRIVIAL → Quick Check only | MODERATE → + Graveyard | SIGNIFICANT → full DNA
```

**Quick sanity questions (yes/no):**
- Is `aloha-kids-game` the platform root and does `src-tauri/` (or `apps/`) contain the Tauri shell?
- Is the TypeScript version pinned in `package.json` and are there no `any` types in game logic files?
- Are the Vitest unit tests for `aloha-kids-game` passing on the current branch (`npx vitest run`)?

---

## Universal Baseline *(always pre-populated — applies to every project)*

> These are language-agnostic engineering fundamentals. Unlike Canon (which is earned from project experience), these are universally proven rules that every project benefits from on day one. They are NOT placeholders — they are active rules from the moment this DNA file is created.

| ID | Rule | Enforcement | Rationale |
|----|------|-------------|-----------|
| UB1 | No silent fallbacks — errors must surface, never be swallowed or defaulted away | BLOCK | Silent fallbacks create debugging nightmares; errors are information |
| UB2 | TDD-first — no production code without a failing test first | BLOCK | Tests written after code prove nothing; they pass immediately |
| UB3 | Explicit error handling — propagate errors with context; never catch-and-ignore | BLOCK | Error context is essential for debugging; bare catches hide root causes |
| UB4 | No dead code — delete commented-out code and unused imports; git history exists | WARN | Dead code confuses agents and developers about intent |
| UB5 | Structured logging — use tagged, structured log output; no raw console.log in production | WARN | Structured logs enable filtering, alerting, and debugging at scale |

**These rules apply regardless of project maturity level (LEARNING, ESTABLISHED, MATURE).**

---

## North Star *(ranked — earlier values win conflicts)*

> **Greenfield rule**: Seed ≥1 entry derived from the project's domain, stack, or key files discovered
> during Phase 1. The team refines and re-ranks over time — these are starting anchors, not final Canon.

1. **Child delight** — a kid's first reaction to a game is emotional; confusion or lag kills engagement before any logic error matters
2. **Correctness** — game state errors (wrong score, broken progression) destroy trust and fun; they must never silently corrupt
3. **Performance** — kids' games must feel instant; frame jank and input latency are user-visible failures, not minor regressions
4. **Maintainability** — the platform hosts multiple games; patterns established in Game 1 propagate to all future games; get them right early

*(add more entries as the team validates priorities)*

---

## Canon *(proven patterns — max 10)*

> **Greenfield rule**: Leave this section empty (placeholder row only) for new projects. Canon entries must be earned through real decisions and validated patterns — never invented upfront.

| ID | Pattern | Confidence | Scope | Added |
|----|---------|-----------|-------|-------|
| C01 | *(placeholder — populate after first validated architectural decision)* | — | — | — |

---

## Graveyard *(anti-patterns — max 15)*

> Each entry must include WHY it failed and a real example. "Don't do X" without context is useless.

| ID | Anti-Pattern | Severity | Bug/Incident Ref | Added |
|----|-------------|---------|-----------------|-------|
| G01 | *(populate after first production issue)* | — | — | — |

**Severity levels**: CRITICAL (data loss/security) | HIGH (user-facing breakage) | MEDIUM (correctness) | LOW (maintainability)

---

## Wins *(last 5 validated successes — rolling)*

> Positive reinforcement: what worked well that agents should repeat.

*(No wins yet — add after first successful feature ship)*

---

## Tensions *(unresolved trade-offs — max 3 active)*

> **Greenfield rule**: Leave this section with placeholder row only. Tensions must emerge from real decisions encountered during development — never invented upfront.

| Tension | Option A | Option B | Current stance |
|---------|---------|---------|---------------|
| *(None yet — add when genuine trade-offs emerge in development)* | — | — | — |

---

## Hard Blocks *(never do these without explicit human approval)*

| Block | Reason |
|-------|--------|
| Push directly to `main`/`master` | All changes require PR review |
| Skip tests for "quick fixes" | No exceptions to TDD; even minor fixes need a test if behavior changes |
| Commit credentials or API keys | Use environment variables or Tauri secure storage |
| Add game-global mutable state | Shared mutable state across games creates invisible coupling |
| Use `any` type in game logic | Destroys the type-safety that makes TypeScript worthwhile |

---

## Commands Reference

| Command | Test | Coverage | Build |
|---------|------|----------|-------|
| `npx vitest run` | Unit + integration | — | — |
| `npx vitest run --coverage` | — | Line + branch | — |
| `npx tauri build` | — | — | Release |
| `npx tauri dev` | — | — | Dev server |

*(Fill in E2E command once Playwright/WebdriverIO is configured)*

---

## Update Protocol

- **Anyone can propose**: Open a PR adding/modifying a DNA section with a rationale comment
- **Who approves**: tech lead / entire team
- **How often to review**: per-sprint / after each major incident
- **HARD rules** (require full team consensus to change):
  - North Star order
  - CRITICAL-severity Graveyard entries

---

## Maturation Milestones

| Milestone | Target | What to do |
|-----------|--------|-----------|
| Week 1 | Fill Quick Check | Set Stack, Arch, Priority, Load guidance |
| Week 1 | Fill Hard Blocks | List 3-5 operations that require human approval |
| Week 1 | Define North Star | Rank 3-5 project values (correctness > security > ...) |
| Month 1 | First Canon entry | Record one validated architectural decision with evidence |
| Month 1 | First Win | Record one thing that worked well and should be repeated |
| Month 3 | First Graveyard entry | Record one rejected approach with WHY it failed |
| Ongoing | First Tension | Document one genuine trade-off the team hasn't resolved |

**Graduation criteria**:
- **LEARNING → ESTABLISHED**: ≥3 Canon entries + ≥1 Graveyard entry + North Star populated
- **ESTABLISHED → MATURE**: ≥5 Canon + ≥3 Graveyard + ≥1 resolved Tension + reviewed within last 30 days
