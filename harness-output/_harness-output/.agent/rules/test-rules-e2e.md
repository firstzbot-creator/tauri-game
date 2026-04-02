# E2E Test Rules — aloha-kids-game

**Scope**: Full player flows through the Tauri app — from game launch to score screen
**Framework**: Playwright (recommended) or WebdriverIO with Tauri driver
**E2E command**: *(configure once Playwright + Tauri driver is set up — see below)*

---

## Critical Player Flows (must have E2E coverage)

1. Platform launches → game selection screen appears
2. Player selects a game → game loads and renders correctly
3. Player completes a game → score recorded, shown correctly
4. Player restarts game → clean state, no residual from previous run
5. Player exits game → returns to platform shell cleanly

---

## Rules

| Rule | Enforcement |
|------|-------------|
| Test user-observable outcomes, not implementation details | BLOCK |
| Each E2E test is independently runnable (no shared state) | BLOCK |
| Never use production data or production environment | BLOCK |
| E2E tests must not mock the Tauri backend | BLOCK — use a test binary or test config |
| Flag any test taking > 30s — optimize or reclassify | WARN |

---

## Playwright + Tauri Setup (once configured)

```bash
# Install Playwright
npm install -D @playwright/test

# Configure tauri-driver (WebdriverIO) or use Playwright's built-in
# See: https://tauri.app/develop/tests/webdriver/

# Run E2E suite
npx playwright test 2>&1 | tail -60
```

Add `{e2e command}` to `PROJECT_DNA.md` Commands Reference once configured.

---

## Commit Convention

Tag E2E test commits: `test(e2e): add flow for {scenario} [e2e]`

---

## Escalation

If E2E infrastructure (Tauri test binary, Playwright config) is not yet set up, surface as a signal:
`docs/signals/{date}-e2e-infra-not-configured.md` — do not skip writing unit/integration tests while waiting.
