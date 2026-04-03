// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createAudioManager,
  loadMutePreference,
  saveMutePreference,
  MUSIC_VOLUME,
  SFX_VOLUME,
  MUTE_STORAGE_KEY,
} from './audio.js';
import type { AudioManager, SfxName } from './audio.js';

// Mock localStorage since Node.js built-in localStorage conflicts with jsdom
const mockStorage = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string): string | null => mockStorage.get(key) ?? null,
  setItem: (key: string, value: string): void => { mockStorage.set(key, value); },
  removeItem: (key: string): void => { mockStorage.delete(key); },
  clear: (): void => { mockStorage.clear(); },
  get length(): number { return mockStorage.size; },
  key: (_index: number): string | null => null,
};

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
});

describe('loadMutePreference', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('returns false when localStorage is empty', () => {
    expect(loadMutePreference()).toBe(false);
  });

  it('returns true when localStorage has "true"', () => {
    mockStorage.set(MUTE_STORAGE_KEY, 'true');
    expect(loadMutePreference()).toBe(true);
  });

  it('returns false when localStorage has "false"', () => {
    mockStorage.set(MUTE_STORAGE_KEY, 'false');
    expect(loadMutePreference()).toBe(false);
  });
});

describe('saveMutePreference', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('writes to localStorage with correct key', () => {
    saveMutePreference(true);
    expect(mockStorage.get(MUTE_STORAGE_KEY)).toBe('true');
  });

  it('writes false correctly', () => {
    saveMutePreference(false);
    expect(mockStorage.get(MUTE_STORAGE_KEY)).toBe('false');
  });
});

describe('createAudioManager', () => {
  let manager: AudioManager;

  beforeEach(() => {
    mockStorage.clear();
    manager = createAudioManager({
      musicVolume: MUSIC_VOLUME,
      sfxVolume: SFX_VOLUME,
      muted: false,
    });
  });

  it('returns object with all required methods', () => {
    expect(typeof manager.startMusic).toBe('function');
    expect(typeof manager.stopMusic).toBe('function');
    expect(typeof manager.playSfx).toBe('function');
    expect(typeof manager.toggleMute).toBe('function');
    expect(typeof manager.isMuted).toBe('function');
  });

  it('isMuted returns false when created with muted: false', () => {
    expect(manager.isMuted()).toBe(false);
  });

  it('isMuted returns true when created with muted: true', () => {
    const muted = createAudioManager({
      musicVolume: MUSIC_VOLUME,
      sfxVolume: SFX_VOLUME,
      muted: true,
    });
    expect(muted.isMuted()).toBe(true);
  });

  it('toggleMute returns opposite of current mute state', () => {
    const result = manager.toggleMute();
    expect(result).toBe(true);
    expect(manager.isMuted()).toBe(true);
  });

  it('toggleMute called twice returns to original state', () => {
    manager.toggleMute();
    const result = manager.toggleMute();
    expect(result).toBe(false);
    expect(manager.isMuted()).toBe(false);
  });

  it('playSfx with invalid name logs warning and does not throw', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => manager.playSfx('nonexistent' as SfxName)).not.toThrow();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('music volume is <= 0.5', () => {
    expect(MUSIC_VOLUME).toBeLessThanOrEqual(0.5);
    expect(MUSIC_VOLUME).toBeGreaterThanOrEqual(0.3);
  });

  it('sfx volume is <= 0.7', () => {
    expect(SFX_VOLUME).toBeLessThanOrEqual(0.7);
    expect(SFX_VOLUME).toBeGreaterThanOrEqual(0.5);
  });
});
