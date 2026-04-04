# Issue: No music or sound effects play

| Field | Content |
|-------|---------|
| Issue | "i didn't hear any music, something wrong?" |
| Component | cat-adventure (game) |
| Type | Bug |
| Severity | High — audio is core to child delight (North Star #1) |
| Status | Resolved |
| Graveyard match | no match |
| Suspected cause | All audio asset files are missing from `apps/cat-adventure/src/assets/audio/`. The directory exists but is empty. The code references `music.mp3` and 9 SFX files (`meow.mp3`, `chime.mp3`, `rustle.mp3`, `discovery.mp3`, `player-attack.mp3`, `boss-hit.mp3`, `player-hit.mp3`, `victory-jingle.mp3`, `defeat-sound.mp3`) but none exist on disk. |
| Resolution | Generated all 10 synthesized MP3 audio files and placed them in `apps/cat-adventure/src/assets/audio/`. Added `audio-assets.test.ts` regression guard. |
| Affected scope | `apps/cat-adventure/src/audio.ts` (loading code), `apps/cat-adventure/src/assets/audio/` (empty directory) |
| Reproduction steps | 1. Launch cat-adventure game (`python3 ranzi-game.py run --game cat-adventure` or `npx tauri dev`) <br> 2. Click or press arrow keys to trigger `startMusicOnInteraction()` <br> 3. Observe: no music plays, no SFX on discovery or combat <br> 4. Open browser devtools console — see `[audio] Music play failed:` warnings from failed `HTMLAudioElement.play()` calls |

## Diagnostic Details

- `apps/cat-adventure/src/assets/audio/` — directory exists, contains **0 files**
- `audio.ts:50` — `initMusic()` constructs URL to `./assets/audio/music.mp3` (file missing)
- `audio.ts:59-69` — `initSfx()` iterates 9 SFX names, all resolve to missing files
- `audio.ts:77-79` — `play()` rejects, caught and logged as `[audio] Music play failed:` (silent to user)
- `main.ts:100-103` — `startMusicOnInteraction()` correctly gates music behind first user gesture (autoplay policy handled)
- `main.ts:93` — mute preference loaded correctly from localStorage
- No existing bug reports match this issue in `docs/bugs/`

## Missing Files

1. `music.mp3` — background music loop
2. `meow.mp3`
3. `chime.mp3`
4. `rustle.mp3`
5. `discovery.mp3`
6. `player-attack.mp3`
7. `boss-hit.mp3`
8. `player-hit.mp3`
9. `victory-jingle.mp3`
10. `defeat-sound.mp3`
