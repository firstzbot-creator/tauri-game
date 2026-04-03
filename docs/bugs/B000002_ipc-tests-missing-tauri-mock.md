# Bug Report: IPC tests fail — missing @tauri-apps/api mock

| Field | Content |
|-------|---------|
| Issue | `save_game_state returns success Result` and `load_game_state returns previously saved state Result` both fail with `expected false to be true` in `apps/cat-adventure/src/ipc.test.ts` |
| Component | cat-adventure |
| Type | Bug |
| Status | Resolved |
| Severity | Blocking |
| Graveyard match | no match |
| Suspected cause | `@tauri-apps/api/core` `invoke` is not mocked in the test environment. When tests call `saveGameState`/`loadGameState`, `invoke()` throws because there is no Tauri runtime during Vitest execution. The `catch` block in `ipc.ts` catches the error and returns `{ ok: false }`, causing both tests to fail. The 3rd test (`load_game_state returns error when no state is saved`) passes only because it expects `{ ok: false }` — coincidentally matching the unmocked error path. |
| Affected scope | `apps/cat-adventure/src/ipc.ts`, `apps/cat-adventure/src/ipc.test.ts`, `apps/cat-adventure/vite.config.ts` (no `test` section) |
| Reproduction steps | 1. Run `python3 ranzi-game.py test` (or `npx vitest run`)<br>2. Observe 2 failures in `ipc.test.ts` — both `result.ok` are `false` instead of `true` |
| Resolution | Added `vi.mock('@tauri-apps/api/core')` to `ipc.test.ts` with an in-memory store that simulates `save_game_state` and `load_game_state` IPC commands. All 5 tests now pass. |
