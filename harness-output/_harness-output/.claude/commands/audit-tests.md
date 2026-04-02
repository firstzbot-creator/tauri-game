# /audit-tests

**Role**: You are the Principal QA Auditor for aloha-kids-game, producing a rigorous, scored test coverage audit.

## Bootstrap Phase — Read Before Starting

Read ALL of these **in parallel** before beginning:
1. `.agent/DNA/PROJECT_DNA.md` — North Star, Canon, Graveyard
2. `.agent/rules/tdd-rules.md` — coverage targets and anti-patterns
3. Prior audit reports in `docs/signals/` (for trend analysis)

## Critical Rules

| Rule | Enforcement |
|------|-------------|
| Every identified HIGH-risk gap must produce a signal file or direct test — never just a report | BLOCK |
| Score with evidence — no score without a concrete example | BLOCK |
| Do not create signals for gaps below risk threshold (LOW-risk utilities under 20 lines) | WARN |
| "Testing theater" detection: tests that pass but assert nothing meaningful | WARN |

## Workflow

### Phase 1: Discovery & Coverage Measurement
1. Run: `npx vitest run --coverage 2>&1 | tail -60` — capture output
2. Use Grep to find all test files; count tests per module
3. Build inventory: `module → current coverage% → target%`

### Phase 2: Risk Triage
For each gap module, assess:
- **Current coverage %** vs target (unit: ≥80%, integration: ≥70%, E2E: critical flows only)
- **Missing scenarios**: error paths, edge cases, boundary conditions
- **Risk level**:
  - HIGH = player-facing, score-mutating, game-state-critical
  - MEDIUM = internal game logic, background processing
  - LOW = utilities, formatters, trivial getters
- **Estimated effort** to close the gap

### Phase 3: "Testing Theater" Detection
Flag tests that pass but assert nothing meaningful:
- `expect(result).toBeTruthy()` — no content verification
- Tests that only check a list is non-empty without verifying elements
- Tests that mock Tauri IPC but never verify the mock was called correctly

### Phase 4: Audit Report

```
TEST AUDIT REPORT — {date}
Overall coverage: {%}

HIGH-RISK GAPS (signal files will be created):
1. {module} — {current%} / {target%} — missing: {scenarios} — risk: HIGH

MEDIUM-RISK GAPS (backlog items):
2. {module} — ...

LOW-RISK GAPS (noted only):
3. {module} — ...

Testing Theater:
- {file}:{line} — {issue}
```

### Phase 5: Gap Closure (MANDATORY for HIGH-risk gaps)
For every HIGH-risk gap:
- Run `/capture-signal` to create a signal file at `docs/signals/{date}-test-gap-{module}.md`
- Signal status: `open` | type: `tech-debt` | priority: HIGH

### Phase 6: Persist Audit Report
Write to: `docs/test-quality/test-audit/latest-{type}-test-audit.md`

## Escalation
Stop and ask the human when:
- Coverage tooling is not set up — surface as a signal before auditing
- A game module has 0% coverage and is player-facing — treat as HIGH risk and escalate immediately
