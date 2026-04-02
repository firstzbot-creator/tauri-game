# Performance Mandate — aloha-kids-game

**Rationale**: Kids' games must feel instant and responsive. Frame jank, input latency, and slow transitions
destroy the child's experience before any game logic error would be noticed. Performance is a first-class
quality dimension in this project, not an afterthought.

---

## Performance Envelope

| Operation | Target | Enforcement |
|-----------|--------|-------------|
| Game launch (from click to playable) | ≤ 2 seconds | BLOCK if spec omits this AC |
| Input response (tap/click → visual feedback) | ≤ 50ms | BLOCK if spec omits this AC |
| Score save via Tauri IPC | ≤ 100ms | WARN |
| Game state transition (level change, win screen) | ≤ 500ms | WARN |
| Platform shell load (game picker) | ≤ 1 second | WARN |
| Frame rate during gameplay | ≥ 60fps (no sustained drops) | WARN |

---

## Performance Test Tagging

All performance tests must include a latency assertion. Tag performance tests with a comment:

```typescript
// @perf-test: input latency
it('processes tap input in < 50ms', () => {
  const start = performance.now();
  handleTap({ x: 100, y: 200 });
  expect(performance.now() - start).toBeLessThan(50);
});
```

**Integration test quota**: ≥ 20% of integration tests must be tagged `@perf-test`.

---

## Performance Regression Signals

A performance regression is any of the following:
- Game launch time exceeds 2 seconds in CI
- Input response measured at > 100ms in a test (doubling of target)
- A new dependency adds > 500KB to the game SPA bundle
- Frame rate drops below 30fps in a benchmark

When a regression is detected:
1. Create a signal: `docs/signals/{date}-perf-regression-{component}.md`
2. Link to the failing test or benchmark result
3. Block the PR until the regression is resolved or formally deferred

---

## Performance Design Questions (for every spec)

Every spec's Architecture section must answer:
1. **Latency-sensitive operations?** Name them or state "none"
2. **Performance envelope?** Target in ms, or "none — no envelope defined"
3. **Throughput concerns?** Concurrent players, data volume, or "none"
4. **Regression signals?** How to detect degradation, or "none — no signals defined"

Leaving any question blank is a BLOCK on Phase 2 gate of `/spec-build`.
