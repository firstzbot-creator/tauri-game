# Changelog — aloha-kids-game

All notable changes to this project are documented here.

---

## [Unreleased]

### Added
- Core `CatState` logic for the Cat Adventure game (Spec 000002)
- Mock `save_game_state` and `load_game_state` IPC boundaries using Result pattern (Spec 000002)
- `ranzi-game.py` — global developer CLI with `init`, `test`, and `run` commands (spec_000001)
- Python unit test suite in `tests/cli/` covering all CLI modules (36 tests)
- `COMMAND_MANIFEST.md` Developer CLI section documenting `ranzi-game.py` as agent interface
