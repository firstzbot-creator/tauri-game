# aloha-kids-game — Agent Onboarding

> This file orients agents at the start of every session.
> Run `/bootstrap-context` to load full project state.

---

## Quick Start

1. Read `.agent/DNA/PROJECT_DNA.md` — Quick Check section tells you priorities and rules
2. Read `.agent/rules/README.md` — know which rules apply to your task
3. Run `/bootstrap-context` — load active specs, git state, and verify project health

---

## What This Project Is

**aloha-kids-game** is a Tauri-based desktop platform for kids' games. The Tauri shell (Rust) hosts multiple individual game SPAs (TypeScript). Each game is an independently developed, self-contained single-page application. The platform shell handles game launching, score persistence (via Tauri IPC), and shared services.

Key constraint: **child delight comes first**. Games must feel instant, responsive, and forgiving. Any lag, crash, or confusing state is a first-class failure.

---

## Agent Harness Documentation

| File | Purpose | When to read |
|------|---------|--------------|
| `.agent/DNA/PROJECT_DNA.md` | Project DNA — North Star, Canon, Graveyard | Every session start |
| `.agent/rules/coding-rules.md` | TypeScript + Tauri coding standards | Writing code |
| `.agent/rules/tdd-rules.md` | Vitest TDD workflow | Writing tests |
| `.agent/rules/spec-rules.md` | Specification creation and lifecycle | Building features |
| `.agent/rules/error-handling-rules.md` | TypeScript/Tauri error patterns | Handling errors |
| `.agent/harness/CONTEXT_STRATEGY.md` | Context management strategy | Long sessions |
| `.agent/harness/ERROR_RECOVERY.md` | Loop detection and recovery | When stuck |
| `.agent/harness/SESSION_CONTINUITY.md` | Session recovery patterns | After breaks |

---

## Key Commands

| Command | Use When |
|---------|----------|
| `/bootstrap-context` | Starting any session |
| `/spec-build` | Creating a new game or platform feature spec |
| `/spec-implement` | Building a feature from an approved spec |
| `/fix-bug` | Investigating and fixing a game or platform bug |
| `/code-review` | Reviewing code changes |
| `/audit-tests` | Checking test coverage gaps |
| `/capture-signal` | Logging a bug or improvement observation |
| `/spec-archive` | Archiving completed specs |

> **Note**: `/create-release` must be built once the Tauri release pipeline is established.
> Run `/harness-enhancement` to scaffold it after the release workflow is confirmed.

---

## Hard Rules (Never Violate Without Explicit Human Approval)

- Never push directly to `main` / `master`
- Never delete spec files — archive them with `/spec-archive`
- Never skip tests for "quick fixes"
- Never commit secrets or credentials
- Never add shared mutable state across game modules
- Never use `any` type in game logic

---

## Platform Architecture At a Glance

```
aloha-kids-game/
├── src-tauri/          # Rust — Tauri shell, IPC commands, native APIs
├── apps/               # Game SPAs (each is a separate TypeScript project)
│   └── {game-name}/    # One directory per game
├── packages/           # Shared TypeScript utilities
│   └── shared/         # Types, utilities, event definitions
├── src/                # Platform shell frontend (game picker UI)
├── .agent/             # Agent harness (DNA, rules, harness layers)
├── .claude/commands/   # Slash-command workflows
└── docs/               # Specs, signals, bugs, architecture decisions
```

---

## Why This Harness Exists — The Class Analogy

Think of this harness as a C++ class:

| Role | Harness Element | Analogy |
|------|----------------|---------|
| Public interface | Skills and commands (`/spec-build`, `/fix-bug`, ...) | Class public methods |
| Runtime backend | Agent context + rules (`.agent/DNA`, `.agent/rules`, `.agent/harness`) | OS / runtime layer |
| Member state | All generated documents (specs, logs, perf docs, test-quality, signals) | Class member variables |

**Skills CREATE and MAINTAIN documents.** Documents are the persistent state of the project.
**Agent context GOVERNS agent behavior** the way a runtime governs execution.

---

## When in Doubt

- Architecture decisions → `docs/architecture/decisions/`
- Project patterns → `.agent/DNA/PROJECT_DNA.md` Canon section
- What NOT to do → `.agent/DNA/PROJECT_DNA.md` Graveyard section
- Rules for your task → `.agent/rules/README.md`

When uncertain: **ask the human.** Flag uncertainty explicitly.
