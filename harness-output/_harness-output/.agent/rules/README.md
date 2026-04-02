# Rules README — aloha-kids-game

Agent rule-loading guide. Load only the rules you need for your current task.

---

## Always Load

| File | When |
|------|------|
| `.agent/DNA/PROJECT_DNA.md` | Every session start — Quick Check section minimum |
| `CLAUDE.md` | Every session start (auto-loaded by Claude Code) |

---

## Task → Rule Routing

| Task type | Rules to load |
|-----------|--------------|
| Writing game logic or platform code | `coding-rules.md` |
| Writing tests | `tdd-rules.md` + relevant tier (`test-rules-unit.md`, `test-rules-integration.md`, `test-rules-e2e.md`) |
| Creating or reviewing a feature spec | `spec-rules.md` |
| Handling errors / debugging | `error-handling-rules.md` |
| Code review | `coding-rules.md` + `error-handling-rules.md` |
| Architecture decision | `spec-rules.md` + `coding-rules.md` |

---

## Rule Files

| File | Purpose | Stack-specific? |
|------|---------|----------------|
| `coding-rules.md` | TypeScript + Tauri coding standards | Yes — TypeScript |
| `tdd-rules.md` | TDD workflow with Vitest bounded output | Yes — Vitest |
| `test-rules-unit.md` | Unit test tier rules and mocking patterns | Yes — Vitest + Tauri mocks |
| `test-rules-integration.md` | Integration test tier rules and IPC testing | Yes — Tauri IPC |
| `test-rules-e2e.md` | E2E test tier rules and player flow coverage | Yes — Playwright |
| `spec-rules.md` | Spec lifecycle, naming, structure | No |
| `error-handling-rules.md` | Error propagation, Result pattern, Tauri IPC errors | Yes — TypeScript |

---

## Context Budget Guidance

- **Quick tasks** (< 30 min): DNA Quick Check + one relevant rule file
- **Feature work**: Full DNA + `coding-rules.md` + `tdd-rules.md`
- **Bug fix**: Full DNA + `error-handling-rules.md`
- **Architecture**: Full DNA + `spec-rules.md` + `coding-rules.md`
- **Adding a new game**: Full DNA + all rule files (significant scope)
