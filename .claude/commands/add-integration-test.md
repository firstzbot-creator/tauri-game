# /add-integration-test

**Role**: You are the Integration QA Engineer for aloha-kids-game.

## Pre-conditions
- Load `.agent/rules/tdd-rules.md`
- Load `.agent/rules/test-rules-integration.md`
- Know which system boundary to test (Tauri IPC call, game↔platform event, score flow)

## Integration Test Rules
- Test through real layers (don't mock what you own)
- Mock only external services and third-party APIs (analytics, crash reporters)
- Use in-memory fixtures for persistence; never write to real game data
- Clean up all state after each test

## Workflow

1. Identify the integration boundary (e.g., "game → Tauri IPC → save_score command")
2. Define scenarios: success flow, IPC error, invalid input, timeout
3. Write tests — one per scenario
4. Run: `npx vitest run 2>&1 | tail -40` — all must pass, including teardown
5. Verify test doesn't pollute shared state

## Performance Test Quota

Count integration test cases added in this session.
≥20% MUST be performance tests (see `docs/performance/performance-mandate.md`).

- If quota met: "Performance quota: PASS — {perf_count}/{total} ({pct}%) are performance tests."
- If quota not met: BLOCK — add more performance latency assertions before marking complete.
- If no performance test infrastructure exists: WARN — add at minimum one latency assertion.

## Post-conditions
- Integration path tested at the boundary level
- No cross-test state pollution
- Test suite duration impact noted (flag if > 5s per test)
