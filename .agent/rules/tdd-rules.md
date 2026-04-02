# TDD Rules — aloha-kids-game

**Stack**: TypeScript / Vitest
**Test command**: `npx vitest run`
**Coverage command**: `npx vitest run --coverage`

---

## Core TDD Protocol (BLOCK)

| Rule | Enforcement |
|------|-------------|
| Write a failing test BEFORE production code | BLOCK — delete code and write the test first |
| A test must fail for the RIGHT reason (not a compile/import error) | BLOCK — fix the environment, not the test |
| Run full test suite before marking any task complete | BLOCK |
| No `test.skip` or `it.skip` without a linked issue | BLOCK |

---

## Red-Green-Refactor Cycle

```
RED    → Write the smallest test that expresses the intended behavior; run it; confirm it FAILS
GREEN  → Write the minimum production code to make the test pass; run it; confirm it PASSES
REFACTOR → Clean up without changing behavior; run tests again; confirm still GREEN
```

Never skip to GREEN without a RED step first.

---

## Coverage Targets

| Tier | Target | Rationale |
|------|--------|-----------|
| Unit | ≥ 80% line, ≥ 70% branch | Game logic must be unit-testable in isolation |
| Integration | ≥ 70% cross-component paths | Tauri IPC, game↔platform events |
| E2E | All critical player flows | New game → play → score → restart |

---

## Bounded Test Output

Pipe test output to `tail` to prevent log floods during CI or long sessions:

```bash
# Run unit tests with bounded output (last 40 lines)
npx vitest run 2>&1 | tail -40

# Run with coverage
npx vitest run --coverage 2>&1 | tail -60

# Run a single game's tests
npx vitest run --project aloha-kids-game 2>&1 | tail -40
```

---

## Test File Conventions

- Unit test files: `src/**/*.test.ts` or `src/**/*.spec.ts`
- Integration test files: `src/**/*.integration.test.ts`
- E2E test files: `e2e/**/*.e2e.ts` (Playwright or WebdriverIO)
- Test helpers/fixtures: `src/**/__fixtures__/` or `test/fixtures/`

---

## Test Quality Rules

| Rule | Enforcement |
|------|-------------|
| Each test has exactly ONE assertion focus | WARN |
| Test names describe scenario AND expected outcome | WARN |
| No test-to-test dependencies (order-independent) | BLOCK |
| All mocks reset between tests (`vi.clearAllMocks()` in `afterEach`) | BLOCK |
| No network calls in unit tests (mock Tauri invoke) | BLOCK |
| Tests must run < 500ms each in isolation | WARN |

---

## Mocking Tauri IPC in Tests

```typescript
import { vi } from 'vitest';

vi.mock('@tauri-apps/api/tauri', () => ({
  invoke: vi.fn(),
}));

import { invoke } from '@tauri-apps/api/tauri';

beforeEach(() => {
  vi.mocked(invoke).mockResolvedValue(undefined);
});

afterEach(() => {
  vi.clearAllMocks();
});
```

---

## Anti-Patterns (never do these)

| Pattern | Why | Fix |
|---------|-----|-----|
| Writing tests after the implementation | Tests written post-hoc always pass; they prove nothing | Write the failing test first |
| `expect(result).toBeTruthy()` for non-trivial results | Testing theater — asserts almost nothing | Assert the specific value: `expect(result).toBe(42)` |
| Tests that depend on execution order | Brittle — test runners may parallelize | Each test must arrange its own state |
| Testing implementation details (private internals) | Brittle — refactoring breaks tests for no user-visible reason | Test observable behavior, not how it's done |
| `vi.spyOn` without `mockImplementation` in unit tests | Calls real code — not a unit test | Always provide a mock implementation |
