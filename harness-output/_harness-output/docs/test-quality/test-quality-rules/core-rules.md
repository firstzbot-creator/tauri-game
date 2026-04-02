# Test Quality Rules — aloha-kids-game

Core rules for the test quality system. Updated by `/handle-test-audit` after human confirmation.

**Generated**: 2026-04-01 (harness init)

---

## Foundational Rules

| ID | Rule | Tier | Rationale | Added |
|----|------|------|-----------|-------|
| TQ1 | Every unit test must have exactly one assertion focus | Unit | Tests with multiple focuses fail for unclear reasons | 2026-04-01 |
| TQ2 | Unit tests must mock all `@tauri-apps/api` imports | Unit | Calling real Tauri in unit tests makes them slow and environment-dependent | 2026-04-01 |
| TQ3 | `vi.clearAllMocks()` must be called in `afterEach` for all test files with mocks | Unit | Stale mocks from one test corrupt the next | 2026-04-01 |
| TQ4 | Integration tests must assert latency for any IPC call (≥ 20% of integration tests must be `@perf-test`) | Integration | Kids' games have strict latency requirements — untested IPC paths will regress | 2026-04-01 |
| TQ5 | E2E tests must be tagged with `[e2e]` in their commit message and have a one-line comment describing the player outcome protected | E2E | Enables tracing which flows are covered; prevents silent deletion | 2026-04-01 |
| TQ6 | No `expect(result).toBeTruthy()` for non-trivial game state — assert the specific value | All | Testing theater: asserting truthiness proves almost nothing about game correctness | 2026-04-01 |

---

## Coverage Targets

| Maturity | Unit | Integration | E2E |
|----------|------|-------------|-----|
| LEARNING | ≥ 80% line / ≥ 70% branch | ≥ 70% cross-component | All critical player flows |
| ESTABLISHED | ≥ 85% | ≥ 75% | All critical + secondary flows |
| MATURE | ≥ 90% | ≥ 80% | All flows |

---

*Append new rules here after running `/handle-test-audit` and receiving human approval.*
