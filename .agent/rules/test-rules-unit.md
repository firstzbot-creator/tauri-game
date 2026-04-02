# Unit Test Rules — aloha-kids-game

**Scope**: Pure TypeScript logic, isolated from Tauri IPC, DOM, and network
**Framework**: Vitest
**Target coverage**: ≥ 80% line, ≥ 70% branch per game module

---

## What belongs in unit tests

- Game logic functions (scoring, level progression, win/loss conditions)
- State reducers and state machines
- Utility functions (formatters, parsers, validators)
- Type guard functions
- Error handling paths (Result type construction)

## What does NOT belong in unit tests

- Tauri `invoke` calls (use integration tests)
- DOM rendering (use component tests or E2E)
- File system access
- Network requests

---

## Isolation Rules

| Rule | Enforcement |
|------|-------------|
| Mock all Tauri APIs (`@tauri-apps/api`) | BLOCK |
| Mock all external imports that have side effects | BLOCK |
| No shared mutable state between tests | BLOCK |
| `vi.clearAllMocks()` in `afterEach` | BLOCK |

---

## Naming Convention

```typescript
describe('calculateScore', () => {
  it('returns 0 when no items collected', () => { ... });
  it('applies multiplier when combo is active', () => { ... });
  it('caps score at MAX_SCORE when overflow would occur', () => { ... });
});
```

Pattern: `describe({function}) → it({scenario} → {expected outcome})`

---

## Performance Quota

≥ 20% of integration tests must be performance assertions. For unit tests: flag any test that takes > 50ms.

```typescript
it('processes 1000 game events in < 10ms', () => {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) processEvent(mockEvent);
  expect(performance.now() - start).toBeLessThan(10);
});
```
