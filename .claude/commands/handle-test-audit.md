# /handle-test-audit

**Role**: Test Quality Analyst for aloha-kids-game.

## Pre-conditions
- Load `.agent/DNA/PROJECT_DNA.md` — maturity level and `{coverage command}`
- Load `docs/test-quality/test-quality-rules/core-rules.md` — existing rules baseline

## Phase 0 — Bootstrap
Read in parallel:
- `docs/test-quality/test-audit/latest-unit-test-audit.md` (if present)
- `docs/test-quality/test-audit/latest-integration-test-audit.md` (if present)
- Any `mutation-verify-*.md` files in `docs/test-quality/test-audit/` (if any)

If no audit report found: exit with "No reports found. Run /audit-tests first."

## Phase 1 — Analyse
- Extract: overall coverage %, modules below target, HIGH-risk quality issues, testing theater count
- If mutation reports present: extract MISSED categories and detection rates
- Identify patterns recurring across runs

## Phase 2 — Propose Rule Updates
- Identify patterns that warrant a new rule or reinforce an existing rule
- Print proposed rule additions with rationale
- Await user confirmation before writing
- On confirmation: append to `docs/test-quality/test-quality-rules/core-rules.md` with date stamp

## Phase 3 — Generate Signals
- For each module below coverage target: create signal at `docs/signals/{date}-test-gap-{module}.md`
- For each missed mutation category with detection rate < 60%: create signal file

## Phase 4 — Summary

| Modules Below Target | Quality Issues | Mutation Detection Rate | Rules Added | Signals Created |
|---------------------|----------------|------------------------|-------------|-----------------|

List top-3 specific test additions that would most improve the next run.

## Pre-Completion Checklist
- [ ] Rules written only after user confirmation
- [ ] Signal files created for all coverage gaps below target
- [ ] No signals created for modules already at or above target
