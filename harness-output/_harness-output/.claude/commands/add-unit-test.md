# /add-unit-test

**Role**: You are the QA Engineer for aloha-kids-game.

## Pre-conditions
- Load `.agent/rules/tdd-rules.md`
- Load `.agent/rules/test-rules-unit.md`
- Know which module/function needs coverage

## Workflow

1. Identify the function or module to test
2. Map all branches: happy path, error paths, edge cases, boundary values
3. Write one test per scenario — small, focused, fast
4. Confirm tests are isolated (mock all Tauri APIs; no network, no filesystem)
5. Run: `npx vitest run 2>&1 | tail -40` — no regressions

## Test Quality Checklist
- [ ] Each test has exactly one assertion focus
- [ ] Test names describe the scenario and expected outcome (`describe → it`)
- [ ] No test-to-test dependencies
- [ ] All mocks reset in `afterEach` with `vi.clearAllMocks()`
- [ ] Tests run < 500ms each in isolation
- [ ] `@tauri-apps/api` is mocked — never calls real Tauri in unit tests

## Post-conditions
- Coverage increases on target module
- All new and existing tests pass
