# Harness Init — Intent Declaration
**Project**: aloha-kids-game
**Stack**: TypeScript / Tauri (Rust shell)
**Architecture**: Multi-game platform — each game is a standalone SPA served via Tauri browser engine
**Mode**: Greenfield (no existing source, no existing harness)
**Date**: 2026-04-01

---

## Files to Generate — What → Rationale → Risk

### SDLC Foundation

| File | What | Rationale | Risk |
|------|------|-----------|------|
| `.agent/DNA/PROJECT_DNA.md` | Project DNA with Quick Check, North Star, Canon scaffold, Graveyard | Central knowledge store — agents read this at every session start | Low; greenfield so no existing patterns to conflict |
| `.agent/rules/coding-rules.md` | TypeScript + Tauri-specific coding standards | Prevents class of errors common to TS (any abuse, type assertions, promise errors) | Low |
| `.agent/rules/tdd-rules.md` | TDD workflow with Vitest bounded output wrapper | Enforces test-first discipline; bounded output prevents log floods | Low |
| `.agent/rules/test-rules-unit.md` | Unit test tier rules | Separates unit concerns from integration/e2e | Low |
| `.agent/rules/test-rules-integration.md` | Integration test tier rules | Covers Tauri IPC boundary testing | Low |
| `.agent/rules/test-rules-e2e.md` | E2E test tier rules | Covers full-game flow testing via Playwright/WebdriverIO | Low |
| `.agent/rules/spec-rules.md` | Spec lifecycle management | Keeps spec directory clean and specs actionable | Low |
| `.agent/rules/error-handling-rules.md` | TS/Tauri error handling patterns | Prevents silent fallbacks; enforces Result-style error propagation in TS | Low |
| `.agent/rules/README.md` | Rule routing table | Agents use this to load only relevant rules per task | Low |
| `.agent/DNA/PROJECT_DNA.md` | North Star with ≥1 seeded entry | Per C-INIT-12: must not be bare placeholder | Low |
| `.agent/ONBOARDING.md` | Agent orientation document | Orients any agent at session start | Low |
| `CLAUDE.md` | Claude Code system prompt with Start here + Slash Commands sections | Per C-INIT-20 and C-INIT-13 | Low |
| `docs/specs/README.md` | Spec index scaffold | Starting point for feature tracking | Low |
| `docs/tracking/spec-index.md` | Active spec tracking | Tracks spec status across lifecycle | Low |

### Harness Engineering Layers

| File | What | Rationale | Risk |
|------|------|-----------|------|
| `.agent/harness/CONTEXT_STRATEGY.md` | KV-cache-aware context loading rules | Prevents context window waste; keeps stable prefix stable | Low |
| `.agent/harness/PROGRESSIVE_DISCLOSURE.md` | 3-layer context loading protocol | Prevents front-loading; games are likely to grow large | Low |
| `.agent/harness/ERROR_RECOVERY.md` | Doom-loop prevention, circuit breakers | Critical for multi-game complexity | Low |
| `.agent/harness/SESSION_CONTINUITY.md` | Cross-session state recovery | Multi-game platform means long-lived incremental development | Low |
| `.agent/harness/SELF_LEARNING.md` | Pattern extraction from bugs/wins | Lets DNA improve as the platform matures | Low |
| `.agent/harness/TOOL_MANAGEMENT.md` | Tool count discipline | Tauri projects mix Rust + TS tools; sprawl is a real risk | Low |
| `init.sh` | Session start health check and orientation | Catches broken builds before starting new work | Low |
| `feature_list.json` | JSON feature tracker | Anthropic pattern; persists feature state across sessions | Low |
| `progress.md` | Session progress file | Session continuity anchor | Low |
| `docs/performance/performance-mandate.md` | Performance mandate for kids game context | Games have strict frame-rate and latency requirements | Low |
| `docs/performance/performance-index.md` | Component performance tracking | Tracks which game components have perf envelopes defined | Low |
| `docs/agent-harness/loop-protocol.md` | Loop automation protocol | Enables CRON-driven autonomous testing loops | Low |
| `docs/agent-harness/command-chains.md` | Natural command chains | Documents 7 CRON-driven automation sequences | Low |

### Slash Commands (Claude Code)

All 19+ commands from the catalog, plus auto-loop stubs and a `{project_name}_DRIVER_PROMPT.md`.

### Cursor Rules

`.cursor/rules/project-rules.mdc` — per C-INIT-22, generated unconditionally.

---

## Greenfield Notes

- Canon section: placeholder row only (no invented patterns)
- Tensions section: placeholder row only
- North Star: seeded with ≥1 entry derived from the kids-game domain
- Quick Check questions: derived from discovered stack (TypeScript / Tauri) and directory name
- No existing harness materials to copy to `_existing/`
