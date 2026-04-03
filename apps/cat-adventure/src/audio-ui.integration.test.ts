// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMuteButton } from './mute-button.js';
import { createAudioManager, MUSIC_VOLUME, SFX_VOLUME } from './audio.js';
import type { AudioManager } from './audio.js';

// Mock localStorage
const mockStorage = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string): string | null => mockStorage.get(key) ?? null,
    setItem: (key: string, value: string): void => { mockStorage.set(key, value); },
    removeItem: (key: string): void => { mockStorage.delete(key); },
    clear: (): void => { mockStorage.clear(); },
    get length(): number { return mockStorage.size; },
    key: (_index: number): string | null => null,
  },
  writable: true,
  configurable: true,
});

describe('mute button UI (integration)', () => {
  let manager: AudioManager;

  beforeEach(() => {
    mockStorage.clear();
    manager = createAudioManager({
      musicVolume: MUSIC_VOLUME,
      sfxVolume: SFX_VOLUME,
      muted: false,
    });
  });

  it('renders a button element in the DOM', () => {
    const btn = createMuteButton(manager);
    expect(btn.tagName).toBe('BUTTON');
  });

  it('shows unmuted icon when not muted', () => {
    const btn = createMuteButton(manager);
    expect(btn.textContent).toContain('🔊');
  });

  it('shows muted icon when created with muted manager', () => {
    const mutedManager = createAudioManager({
      musicVolume: MUSIC_VOLUME,
      sfxVolume: SFX_VOLUME,
      muted: true,
    });
    const btn = createMuteButton(mutedManager);
    expect(btn.textContent).toContain('🔇');
  });

  it('toggles icon on click from unmuted to muted', () => {
    const btn = createMuteButton(manager);
    btn.click();
    expect(btn.textContent).toContain('🔇');
  });

  it('toggles icon back on second click', () => {
    const btn = createMuteButton(manager);
    btn.click();
    btn.click();
    expect(btn.textContent).toContain('🔊');
  });

  it('has mute-button class for positioning', () => {
    const btn = createMuteButton(manager);
    expect(btn.classList.contains('mute-button')).toBe(true);
  });
});
