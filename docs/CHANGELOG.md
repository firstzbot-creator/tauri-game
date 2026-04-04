# Changelog — aloha-kids-game

All notable changes to this project are documented here.

---

## [Unreleased]

### Added
- Fight system & first boss: coyote boss entity, combat engine with damage calculation, boss AI (idle/approach/attack), health bars HUD, hit visual feedback (flash, screen shake), victory celebration with particles, defeat overlay with retry, flee mechanic, Space bar attack with cooldown (spec_000006)
- Discovery & living world: interactable objects, collision detection, speech bubbles, sparkle effects, discovery counter, wandering animals (spec_000005)
- Audio system: background music with auto-play on interaction, SFX engine, mute toggle with localStorage persistence (spec_000004)
- Visual world: grass field background, decorative flowers, full-body cat SVG sprite with idle animation (spec_000003)
- Pixel-based coordinate system (800×600 field) replacing 0-10 grid, with click-to-move and arrow key movement (spec_000003)
- Core `CatState` logic for the Cat Adventure game (Spec 000002)
- Mock `save_game_state` and `load_game_state` IPC boundaries using Result pattern (Spec 000002)
- `ranzi-game.py` — global developer CLI with `init`, `test`, and `run` commands (spec_000001)
- Python unit test suite in `tests/cli/` covering all CLI modules (36 tests)
- `COMMAND_MANIFEST.md` Developer CLI section documenting `ranzi-game.py` as agent interface

### Fixed
- Fixed IPC tests failing due to missing `@tauri-apps/api/core` mock in cat-adventure test suite (B000002)
- Fixed `AttributeError` crash in `ranzi_game/runner.py` when `stderr` is None during command failure
- Fixed CLI issue where `vitest run --include` failed due to missing flag in newer Vitest versions
- Resolved `npm error could not determine executable to run` for Tauri by installing `@tauri-apps/cli` in `package.json`
