# /quality-standards

Quality standards and enforcement levels for aloha-kids-game.

## TypeScript / Tauri Quality Standards

| Standard | Level | Enforcement |
|----------|-------|-------------|
| No `any` type in production code | Code quality | BLOCK in code-review |
| No `!` non-null assertions on IPC responses | Code quality | BLOCK in code-review |
| No empty catch blocks | Error handling | BLOCK in code-review |
| No fire-and-forget `invoke()` calls | Error handling | BLOCK in code-review |
| TDD-first — failing test before production code | Process | BLOCK in spec-implement |
| Unit test coverage ≥ 80% | Testing | WARN in audit-unit-test |
| Integration test coverage ≥ 70% | Testing | WARN in audit-integration-test |
| ≥ 20% of integration tests are performance tests | Performance | BLOCK in add-integration-test |
| All critical player flows have E2E tests | Testing | WARN in audit-e2e-test |
| No console.log in production code paths | Logging | BLOCK in code-review |

## DNA Compliance

| Standard | Level | Enforcement |
|----------|-------|-------------|
| No silent fallbacks (`\|\| null`, `\|\| default`) | UB1 | BLOCK |
| No bare catch-and-ignore | UB3 | BLOCK |
| Structured logging with tags | UB5 | WARN |
| No dead code or commented-out game logic | UB4 | WARN |

## Performance Standards

See `docs/performance/performance-mandate.md` for full envelope and tagging conventions.

| Operation | Target |
|-----------|--------|
| Game launch | ≤ 2 seconds |
| Input response | ≤ 50ms |
| Score save (IPC) | ≤ 100ms |
| Frame rate | ≥ 60fps sustained |

## Spec Quality Standards

| Standard | Enforcement |
|----------|-------------|
| All 3 test tiers present in Verification | BLOCK |
| Performance design questions answered | BLOCK |
| Acceptance criteria are numbered and testable | BLOCK |
| "Out of scope" section present | BLOCK |
