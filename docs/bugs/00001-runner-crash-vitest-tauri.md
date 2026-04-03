# Bug Report: runner script crashes on vitest and tauri commands

| Field | Content |
|-------|---------|
| Issue | `test` and `run` commands both crash via `ranzi-game.py`. `test` fails with Vitest's `CACError: Unknown option '--include'` and then the python script crashes with `AttributeError` on `completed.stderr.strip()`. `run` fails with `npm error could not determine executable to run` followed by the same `AttributeError`. |
| Component | platform |
| Type | Bug |
| Severity | Blocking |
| Graveyard match | no match |
| Suspected cause | 1) `ranzi_game/runner.py` references `completed.stderr.strip()` when `subprocess.run` has `capture_output=False`, making `stderr` `None`.\n2) `npx vitest run --include` is failing because Vitest v4 does not recognize the `--include`/`--exclude` options via CLI (or they are badly formatted).\n3) `npx tauri dev` is failing because `tauri` CLI is not installed in the workspace (missing from `package.json`, causing `npm error could not determine executable`). |
| Affected scope | `ranzi_game/runner.py`, `ranzi_game/commands/test_cmd.py`, `package.json` |
| Reproduction steps | 1. Run `python3 ranzi-game.py test` or `python3 ranzi-game.py run` in root folder.<br>2. Observe the command failure output followed by the Python traceback. |
| Next action | **Resolved**: `runner.py` crash fixed, `test_cmd.py` vitest flags fixed, `@tauri-apps/cli` added to package.json. |
