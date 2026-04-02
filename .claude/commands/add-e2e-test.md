# /add-e2e-test

**Role**: You are the E2E QA Engineer for aloha-kids-game.

## Purpose
Add end-to-end tests that verify critical player flows through the full Tauri app stack — from game selection through gameplay to score display.

## Pre-conditions
- Load `.agent/rules/tdd-rules.md`
- Load `.agent/rules/test-rules-e2e.md`
- Identify the critical player flow to test
- E2E tests are expensive — only write them for flows where unit/integration tests cannot provide equivalent confidence

## Critical Rules
| Rule | Enforcement |
|------|-------------|
| Test user-observable outcomes, not implementation details | BLOCK |
| Each E2E test must be independently runnable (no shared state) | BLOCK |
| Must not use production data or production environment | BLOCK |
| Must not mock the Tauri backend — use a test binary or test config | BLOCK |
| Flag any test that takes > 30s | WARN |

## Workflow

1. Name the flow under test (e.g., "Player selects game → game loads → score saved on exit")
2. Define the happy path scenario and up to 2 critical failure scenarios
3. Write the test using the project's E2E framework (Playwright — see `test-rules-e2e.md`)
4. Run in isolation with the configured `{e2e command}`
5. Confirm the test fails for the right reason if the behavior is broken
6. Commit with tag `[e2e]` in the commit message

## Post-conditions
- E2E test passes in CI
- Flow is documented in the test file with a one-line comment describing what user outcome it protects
- Test runtime logged — flag if above threshold

## Escalation
Stop and ask the human when:
- E2E infrastructure (Tauri test binary, Playwright config) is not yet set up — surface as a signal first
- The flow requires mocking Tauri internals that cannot be stubbed in E2E context
