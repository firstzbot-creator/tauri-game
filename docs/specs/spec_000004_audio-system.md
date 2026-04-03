---
id: spec_000004
title: Audio System (Music & SFX)
status: completed
created: 2026-04-02
author: Claude (spec-build)
game: cat-adventure
depends_on: spec_000002
---

# Problem Statement

The Cat Adventure game has no audio — no background music, no sound effects. For a kids' game, sound is a primary engagement driver. A cheerful background track and satisfying interaction sounds transform a silent screen into an inviting world. Music should auto-play and a mute toggle must exist for parents.

# Scope

**IN SCOPE:**
- Audio manager module that handles loading, playing, pausing, and muting audio
- One background music track — royalty-free, kid-friendly, looping, ~60-120 seconds
- Short sound effects (3-4): meow, chime/sparkle, rustle, discovery jingle
- Auto-play on first user interaction (respects browser autoplay policy)
- Mute/unmute toggle — small speaker icon in corner of screen, persists via localStorage
- Volume kept at a gentle level (0.3-0.5 for music, 0.5-0.7 for SFX)
- Graceful handling when audio files fail to load (log warning, continue silently)

**OUT OF SCOPE:**
- Multiple music tracks or track switching
- Volume slider (just mute/unmute for simplicity)
- Spatial audio or panning
- Audio recording or microphone access
- Music selection UI
- Tauri-side audio handling (all done in browser via Web Audio / HTMLAudioElement)

# Acceptance Criteria

1. Background music begins playing on the first user interaction (click or keypress) after game load
2. Music loops continuously without gaps
3. A mute/unmute icon is visible in the top-right corner of the game screen
4. Clicking the mute icon silences all audio; clicking again restores it
5. Mute preference persists across sessions (stored in localStorage)
6. Sound effects play on relevant game events (exposed via a `playSfx(name)` function for other modules)
7. If an audio file fails to load, the game continues without crashing — a structured warning is logged
8. Music volume is ≤0.5 and SFX volume is ≤0.7 (gentle for kids' ears)
9. **Performance**: Audio playback initiation completes in ≤50ms after trigger event

# Architecture & Design

## Module Design

### `audio.ts` — Audio manager

```typescript
type SfxName = 'meow' | 'chime' | 'rustle' | 'discovery';

type AudioManagerConfig = {
  musicVolume: number;   // 0.0-1.0
  sfxVolume: number;     // 0.0-1.0
  muted: boolean;        // initial mute state from localStorage
};

type AudioManager = {
  startMusic(): void;
  stopMusic(): void;
  playSfx(name: SfxName): void;
  toggleMute(): boolean;  // returns new mute state
  isMuted(): boolean;
};

function createAudioManager(config: AudioManagerConfig): AudioManager;
function loadMutePreference(): boolean;
function saveMutePreference(muted: boolean): void;
```

- `createAudioManager` creates HTMLAudioElement for music (loop=true) and pre-loads SFX clips
- `startMusic` resumes the music element; called on first user interaction
- `playSfx` clones and plays a short audio clip (allows overlapping SFX)
- `toggleMute` mutes/unmutes all audio and persists to localStorage
- Audio file load errors are caught and logged with context, never thrown

### `mute-button.ts` — Mute toggle UI

```typescript
function createMuteButton(audioManager: AudioManager): HTMLElement;
```

- Renders a small speaker icon (🔊/🔇 or SVG) positioned absolute top-right
- Click handler calls `audioManager.toggleMute()` and updates icon

### Integration with `main.ts`

- On init: create audio manager with saved mute preference
- Register a one-time interaction listener (`click`/`keydown`) that calls `startMusic()`
- Export or expose `playSfx` for use by spec_000005 (discovery events)

## Asset Strategy

- Music: one `.mp3` file at `apps/cat-adventure/src/assets/audio/music.mp3` (royalty-free, ≤1MB)
- SFX: `.mp3` files at `apps/cat-adventure/src/assets/audio/meow.mp3`, `chime.mp3`, `rustle.mp3`, `discovery.mp3` (each ≤100KB)
- All bundled via Vite static asset imports
- Source: royalty-free from sites like freesound.org, pixabay audio, or opengameart.org

## Performance Design

1. **Latency-sensitive operations?** Yes — SFX playback must be near-instant on interaction trigger
2. **Performance envelope?** ≤50ms from event to audible sound start
3. **Throughput concerns?** None — max 2-3 concurrent audio streams (1 music + 1-2 SFX)
4. **Regression signals?** Measure time from `playSfx` call to `AudioElement.play()` promise resolution

# Verification

## Unit Tests (`src/**/*.test.ts`)

- `audio.test.ts`:
  - `createAudioManager` returns object with all required methods
  - `toggleMute` returns opposite of current mute state
  - `toggleMute` called twice returns to original state
  - `loadMutePreference` returns `false` when localStorage is empty
  - `loadMutePreference` returns `true` when localStorage has `'true'`
  - `saveMutePreference` writes to localStorage key `'cat-adventure-muted'`
  - `playSfx` with invalid name logs warning and does not throw

## Integration Tests (`src/**/*.integration.test.ts`)

- `audio-ui.integration.test.ts`:
  - Mute button renders in the DOM with correct initial icon based on saved preference
  - Clicking mute button toggles icon between muted/unmuted states
  - Audio manager `startMusic` is called after first simulated user interaction event

## E2E Tests (Playwright)

- Launch game → click on field → verify no console errors related to audio
- Launch game → click mute button → verify icon changes → reload → verify mute state persists
- (Audio playback verification is limited in E2E — primarily test that no errors occur and UI state is correct)

## QA Director Audit

- **Verdict**: APPROVED
- **DNA Compliance**: No `any` types. Audio load failures are caught and logged with context (never swallowed). No `!` assertions on DOM elements or audio responses.
- **Test Coverage**: All 3 tiers present. Unit tests cover logic and state. Integration tests cover UI rendering. E2E tests verify no-crash and state persistence.
- **Performance**: All 4 perf questions answered. Performance AC included (AC9).
- **Notes**: Browser autoplay policy means music cannot truly "auto-play" — it starts on first interaction. This is the correct behavior and must be documented clearly so testers don't file it as a bug.
