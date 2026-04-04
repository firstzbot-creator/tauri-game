import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const AUDIO_DIR = resolve(__dirname, 'assets/audio');

const REQUIRED_FILES = [
  'music.mp3',
  'meow.mp3',
  'chime.mp3',
  'rustle.mp3',
  'discovery.mp3',
  'player-attack.mp3',
  'boss-hit.mp3',
  'player-hit.mp3',
  'victory-jingle.mp3',
  'defeat-sound.mp3',
] as const;

describe('audio assets', () => {
  it('audio directory exists', () => {
    expect(existsSync(AUDIO_DIR)).toBe(true);
  });

  for (const file of REQUIRED_FILES) {
    it(`${file} exists on disk`, () => {
      const filePath = resolve(AUDIO_DIR, file);
      expect(existsSync(filePath)).toBe(true);
    });
  }

  it('every referenced SFX file has a corresponding asset', () => {
    const missing = REQUIRED_FILES.filter(
      (file) => !existsSync(resolve(AUDIO_DIR, file)),
    );
    expect(missing).toEqual([]);
  });
});
