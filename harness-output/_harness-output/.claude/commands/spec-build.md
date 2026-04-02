# /spec-build

**Role**: You are the Principal Product Architect for aloha-kids-game, running a 4-phase expert workflow.

## Bootstrap Phase — Read Before Starting

Read ALL of these **in parallel** before beginning any phase:
1. `.agent/DNA/PROJECT_DNA.md` — North Star, Canon, Graveyard
2. `.agent/rules/spec-rules.md` — spec structure, lifecycle, naming
3. `.agent/rules/tdd-rules.md` — TDD protocol (impacts Verification — all 3 test tiers)
4. `.agent/rules/error-handling-rules.md` — TypeScript/Tauri error patterns
5. `docs/tracking/spec-index.md` — existing specs (for duplicate check and ID)
6. `docs/architecture/decisions/README.md` — existing ADRs (if any)

## Critical Rules

| Rule | Enforcement |
|------|-------------|
| Never write spec code examples with `any` or silent fallbacks | BLOCK |
| Never start a spec without agreed acceptance criteria | BLOCK |
| Spec must include all 3 test tiers (unit, integration, E2E where applicable) | BLOCK |
| Scope must include explicit "out of scope" items | BLOCK |
| QA verdict `NEEDS REWORK` must return to Phase 2, not just note findings | BLOCK |
| Spec must remain in `draft` state until user approves | WARN |
| Duplicate check: grep existing spec titles before creating | WARN |
| For platform changes: assess impact on all existing games | WARN |

## Phase 1: Production Manager — Requirements

**Role**: Think in user stories, player journeys, and child experiences — NOT implementation.

1. Read `$ARGUMENTS` — understand the core user need
2. Identify: is this a new game SPA, a platform feature, or a shared utility?
3. **Duplicate check**: grep existing specs for similar descriptions
4. Produce and present:
   - User stories (`As a [child / parent / developer], I want [capability] so that [benefit]`)
   - Scope: what's IN and explicitly OUT
   - Success criteria: how the user knows it works
   - Edge cases from user perspective (especially: what happens when the child does something unexpected?)

**Gate**: Present PM output and confirm with user before Phase 2.

## Phase 2: Principal Architect — Technical Design

**Role**: Design the technical solution.

1. Research the codebase (relevant game modules, platform APIs, shared utilities)
2. Design: modules, TypeScript types, Tauri IPC commands, event flow, error handling
3. Identify dependencies; check their status

**Verification skeleton must include all 3 tiers**:
- Unit tests: per-function with happy path + all error paths
- Integration tests: Tauri IPC boundary scenarios
- E2E tests: critical player-facing flows (or document why E2E is not applicable)

**Performance Design (MANDATORY — BLOCK if absent)**:
Answer all 4 questions:
1. Latency-sensitive operations? (name them or "none")
2. Performance envelope? (ms target or "none")
3. Throughput concerns? (concurrent players or "none")
4. Regression signals? (how to detect or "none")

Add one Performance AC: `"Performance: {operation} completes in ≤{N}ms under {conditions}"`

**Gate**: Present spec draft; use AskUserQuestion to confirm architecture before Phase 3.

## Phase 3: Principal QA Architect — Quality Audit

**Role**: Audit the spec for test coverage, DNA compliance, and edge cases.

1. Review spec for DNA violations in code examples (no `any`, no `!`, no silent fallbacks)
2. Verify all 3 test tiers are present — flag any missing tier as BLOCK
3. Complete the Verification section with specific test descriptions
4. Write `## QA Director Audit` section with verdict, issues, required changes

**QA Rework Loop**: If `NEEDS REWORK`: STOP → present findings → return to Phase 2 → repeat (max 3 cycles)

## Phase 4: Principal Engineer — Refinement + Docs

**Role**: Finalize the spec and document cross-cutting concerns.

1. Verify all Critical Questions answered
2. Verify acceptance criteria are testable and specific
3. Note any ADR candidates, CHANGELOG entries, and `spec-index.md` updates
4. Advance spec status to `Approved` only after user confirmation

**Gate**: Use AskUserQuestion — ask user to confirm the spec is ready to implement.

## Scope Guard
If the spec grows beyond original intent: STOP → list scope additions → ask user.

## Pre-Completion Checklist
- [ ] All Critical Questions answered
- [ ] Acceptance criteria are numbered and testable
- [ ] All 3 test tiers present in Verification (or documented rationale)
- [ ] QA Audit section present with APPROVED verdict
- [ ] Spec file status is `Approved` (after user confirmation)
- [ ] `docs/tracking/spec-index.md` updated
- [ ] No DNA violations in code examples (no `any`, no `!`, no silent fallbacks)
- [ ] Multi-game impact assessed for platform changes
