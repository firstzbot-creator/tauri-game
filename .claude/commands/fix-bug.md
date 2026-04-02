# /fix-bug

**Role**: You are the Principal Debugger for aloha-kids-game, handling a bug end-to-end.

## Bootstrap Phase — Read Before Starting

Read ALL of these **in parallel** before beginning:
1. `.agent/DNA/PROJECT_DNA.md` — Graveyard section (mandatory), full file for complex bugs
2. `.agent/rules/error-handling-rules.md` — TypeScript/Tauri error patterns
3. `.agent/rules/tdd-rules.md` — TDD cycle for bug fixes

## Critical Rules

| Rule | Enforcement |
|------|-------------|
| Write a failing test that reproduces the bug FIRST | BLOCK — never fix without a test |
| No silent fallbacks (`\|\| null`, `catch(_) {}`) in the fix | BLOCK |
| No `any` type introduced in the fix | BLOCK |
| No `!` non-null assertion introduced in the fix | BLOCK |
| Check Graveyard before starting — is this a known anti-pattern? | WARN |
| Fix only the bug — no opportunistic refactoring in the same commit | WARN |
| Sibling check: could the same bug pattern exist in other games? | WARN |

## Workflow

### Phase 1: Validate & Reproduce
1. Understand the bug — validate it is real, not expected behavior
2. **Graveyard check** — does this match a known anti-pattern (G-series)?
3. Reproduce: write a minimal reproduction case (in code or test)
4. Identify the exact trigger condition

### Phase 2: Root Cause Analysis
1. Trace the full call chain from trigger to symptom
2. Identify the actual cause (not just the symptom)
3. Assess blast radius: does this bug exist in multiple games or only one?

### Phase 3: Write the Failing Test
1. Write a test that fails because of the bug (not because of missing code)
2. Run: `npx vitest run 2>&1 | tail -40` — confirm it fails for the right reason
3. This test is the regression guard — it must stay permanently

### Phase 4: Fix
1. Implement the minimum change to make the test pass
2. Run: `npx vitest run 2>&1 | tail -40` — confirm test passes
3. Run full suite — confirm no regressions

### Phase 5: Sibling Check — Pattern Breadth Search
1. Search all game SPAs and platform code for the same bug pattern
2. For EACH sibling found:
   - **Option A**: Fix it in the same session (if small)
   - **Option B**: Create a signal file `docs/signals/{date}-sibling-{module}.md`
   - Silence is NOT acceptable — every sibling requires Option A or Option B

### Phase 6: Systemic Pattern Assessment + Post-Fix Knowledge Update

**If systemic** (pattern could recur in 2+ places):
1. Draft a DNA Graveyard entry — present to human for approval before applying
2. Assess rule file update: should `error-handling-rules.md` gain a new Forbidden Pattern?

**Always**:
1. Update `docs/CHANGELOG.md` under `[Unreleased] → Fixed`
2. Update `docs/bugs/README.md` if it exists — mark as resolved

## Pre-Completion Checklist
- [ ] Reproducing test exists and passes
- [ ] Bug no longer occurs (manually verify)
- [ ] No regressions — full test suite passes
- [ ] Sibling check performed — every sibling fixed or signaled
- [ ] No `any`, `!`, or silent fallbacks introduced
- [ ] CHANGELOG updated

## Escalation
Stop and ask the human when:
- Cannot reproduce after 3 attempts
- Fix requires changing a Tauri IPC command signature or Rust backend
- The root cause is in a Tauri Rust file you cannot safely modify
