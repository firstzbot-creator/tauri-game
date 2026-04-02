# Integration Test Rules — aloha-kids-game

**Scope**: Cross-component boundaries — game ↔ platform shell, Tauri IPC calls, event bus
**Framework**: Vitest (with Tauri test harness or mocked IPC boundary)
**Target coverage**: ≥ 70% cross-component paths

---

## What belongs in integration tests

- Game ↔ platform event communication (score saved, game completed, leaderboard updated)
- Tauri IPC boundary: `invoke('save_score', ...)` → Rust backend → response
- Multi-module interactions (game state + persistence + UI update)
- Error propagation across module boundaries

## Isolation Rules

| Rule | Enforcement |
|------|-------------|
| Mock only external third-party services (analytics, crash reporters) | BLOCK if own code is mocked |
| Use test fixtures or in-memory state for persistence | BLOCK for real filesystem writes |
| Clean up all state after each test | BLOCK |
| Never use production Tauri backend — use mocked or test binary | BLOCK |

---

## Performance Quota

**≥ 20% of integration tests must include a latency assertion.**

```typescript
it('saves game score via IPC in < 100ms', async () => {
  const start = performance.now();
  const result = await saveScore(42);
  expect(performance.now() - start).toBeLessThan(100);
  expect(result.ok).toBe(true);
});
```

If no performance test infrastructure exists: add at minimum one latency assertion per PR to establish the pattern.

---

## Tauri IPC Integration Testing

When testing real Tauri IPC paths (requires Tauri test binary):
```typescript
import { invoke } from '@tauri-apps/api/tauri';

// Uses real Tauri test binary (not mocked)
it('persists score through IPC round-trip', async () => {
  await invoke('reset_scores');
  await invoke('save_score', { score: 99 });
  const scores = await invoke<number[]>('get_scores');
  expect(scores).toContain(99);
});
```

When testing with mocked IPC boundary:
```typescript
vi.mock('@tauri-apps/api/tauri', () => ({
  invoke: vi.fn().mockResolvedValue([99]),
}));
```

---

## Test Duration Warning

Flag any integration test that exceeds 5 seconds per run. Integration tests over 5s need optimization or reclassification.
