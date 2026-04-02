# aloha-kids-game — Claude Code Context <!-- aloha 0.4.2 -->

## Project Overview

**aloha-kids-game** is a Tauri-based desktop platform for kids' games. The Tauri shell (Rust) hosts multiple individual game SPAs built in TypeScript. Each game is a self-contained single-page application rendered in the Tauri browser engine. The platform manages game launching, score persistence via Tauri IPC, and shared services across all games.

**Stack**: TypeScript / Vite / Vitest / Tauri (Rust shell)
**Repository**: Monorepo — platform shell + multiple game SPAs + shared packages
**Distribution**: Desktop binary via Tauri (macOS, Windows, Linux)

---

## Start here

Run `/bootstrap-context` at the start of every session. It reads:
1. `.agent/DNA/PROJECT_DNA.md` — Quick Check (priorities, stack, blocking rules)
2. `.agent/rules/README.md` — which rules apply to your task
3. `docs/tracking/spec-index.md` — active specs

If any of these files are missing, flag it before starting any work.

---

## Agent Context Loading

**Always load at session start**:
1. Read `.agent/DNA/PROJECT_DNA.md` — Quick Check section minimum
2. Read `.agent/rules/README.md` — to know which rules apply to your task

**Load per task type** (see `.agent/rules/README.md` for full routing table):
- Implementation → `.agent/rules/coding-rules.md`
- Testing → `.agent/rules/tdd-rules.md` + relevant tier file
- Specs → `.agent/rules/spec-rules.md`
- Error handling → `.agent/rules/error-handling-rules.md`

---

## DNA Quick Check *(MANDATORY — read before every task)*

| Rule | Enforcement |
|------|-------------|
| No silent fallbacks — errors must surface, never be swallowed | BLOCK |
| No `any` type in game logic or platform code | BLOCK |
| TDD-first — no production code without a failing test first | BLOCK |
| Explicit error handling — propagate with context; never catch-and-ignore | BLOCK |
| No `!` non-null assertions on IPC responses or user input | BLOCK |
| Structured logging — tagged output; no raw `console.log` in production | WARN |

Full DNA: `.agent/DNA/PROJECT_DNA.md` — read Quick Check section minimum at session start.

---

## Hard Blocks *(never do these without explicit human approval)*

| Block | Reason |
|-------|--------|
| Push directly to `main`/`master` | All changes require PR review |
| Delete or overwrite spec files | Specs are the source of truth; archive, don't delete |
| Skip tests for "quick fixes" | No exceptions to TDD |
| Commit credentials or secrets | Use environment variables or Tauri secure storage |
| Add shared mutable state across game modules | Creates invisible coupling between games |
| Use `any` type in game logic | Destroys type-safety; use `unknown` + type guard |

---

## Project Structure

> **For new projects**: Only harness-generated paths are listed below. Source code structure will be populated by `/bootstrap-context` after initial project setup — do NOT invent paths for files that don't exist yet.

```
aloha-kids-game/
├── .agent/             # Agent DNA, rules, and onboarding
│   ├── DNA/            # PROJECT_DNA.md
│   ├── rules/          # Coding, TDD, spec, error-handling rules
│   └── harness/        # Context strategy, progressive disclosure, error recovery
├── .claude/commands/   # Slash-command skills
├── docs/               # Specs, signals, bugs, architecture decisions
│   ├── specs/          # Feature and bug specifications
│   ├── signals/        # Improvement signals
│   ├── bugs/           # Bug reports and archives
│   └── architecture/   # ADRs and architecture docs
```

*(Source files — `src-tauri/`, `apps/`, `packages/`, `src/` — will be listed here after project setup)*

---

## Bug Fixing Workflow

Bug reports live in `docs/bugs/README.md` (the bug index) and individual files in `docs/bugs/`.

**Naming convention**: `B{NNNNNN}_{slug}.md` — e.g., `B000001_score-not-saving-on-game-exit.md`

**Status values**: Open | Partially Resolved | Resolved

**Commit message format**: `fix({scope}): {short description} (B{NNNNNN})`

**Workflow**:
1. Run `/fix-bug` — diagnoses and writes a failing test before fixing
2. Fix the bug — minimum change to make the test pass
3. Run `/archive-bug` — updates `docs/bugs/README.md` status to Resolved
4. Update `docs/CHANGELOG.md` under `[Unreleased] → Fixed`

---

## Environment Setup

### Canonical CLI (use these)

```bash
# Check and install all dev dependencies (idempotent)
python3 ranzi-game.py init

# Run all tests (unit → integration → E2E)
python3 ranzi-game.py test

# Run only unit tests (Vitest + Python unittest)
python3 ranzi-game.py test --unit

# Run only integration tests
python3 ranzi-game.py test --integration

# Run only E2E tests (skips gracefully if not configured)
python3 ranzi-game.py test --e2e

# Launch the game (auto-discovers available games)
python3 ranzi-game.py run

# Launch a specific game
python3 ranzi-game.py run --game <name>
```

### Internal commands (use only when CLI is unavailable)

```bash
npm install                        # install dependencies
npx vitest run                     # unit tests (internal)
npx vitest run --coverage          # unit tests with coverage
npx tauri dev                      # start dev server
npx tauri build                    # build release
```

---

## Slash Commands Available

Run `/bootstrap-context` at the start of any new session.

| Command | File | Description |
|---------|------|-------------|
| `/bootstrap-context` | `bootstrap-context.md` | Load DNA and orient at session start |
| `/capture-signal` | `capture-signal.md` | Capture and classify a bug/feature signal |
| `/spec-build` | `spec-build.md` | Draft and approve a feature spec (4-phase expert workflow) |
| `/architect-review` | `architect-review.md` | Evaluate a design decision |
| `/spec-implement` | `spec-implement.md` | Build a feature from an approved spec (TDD-first) |
| `/add-unit-test` | `add-unit-test.md` | Add unit test coverage to a module |
| `/add-integration-test` | `add-integration-test.md` | Add integration test coverage |
| `/add-e2e-test` | `add-e2e-test.md` | Add E2E coverage for critical player flows |
| `/audit-tests` | `audit-tests.md` | Find test coverage gaps and surface signals |
| `/handle-test-audit` | `handle-test-audit.md` | Process audit/mutation reports |
| `/test-mutation-gen` | `test-mutation-gen.md` | Plan mutation test set |
| `/test-mutation-verify` | `test-mutation-verify.md` | Apply mutations and measure detection rate |
| `/check-issue` | `check-issue.md` | Read-only triage before fixing |
| `/fix-bug` | `fix-bug.md` | Investigate and fix a bug (TDD-first) |
| `/archive-bug` | `archive-bug.md` | Archive a resolved bug |
| `/code-review` | `code-review.md` | Review code for quality and DNA alignment |
| `/code-simplifier` | `code-simplifier.md` | Reduce complexity without changing behavior |
| `/handle-signal` | `handle-signal.md` | Process an improvement signal |
| `/spec-archive` | `spec-archive.md` | Archive completed specs and absorb knowledge |
| `/audit-unit-test` | `audit-unit-test.md` | Audit unit test coverage (loop-compatible) |
| `/audit-integration-test` | `audit-integration-test.md` | Audit integration test coverage (loop-compatible) |
| `/audit-e2e-test` | `audit-e2e-test.md` | Audit E2E critical flow coverage (loop-compatible) |
| `/run-e2e-test` | `run-e2e-test.md` | Execute E2E suite |
| `/signals-from-bugs` | `signals-from-bugs.md` | Create signals from open bug docs |

---

## Communication Standards

- **Before large changes**: Explain your plan in one paragraph and wait for confirmation
- **When stuck**: State what you've tried and what's blocking you
- **When violating a rule**: Flag it explicitly: "I'm deviating from X because Y — is this OK?"
- **Always confirm**: After completing a task, summarize what changed and what to verify
