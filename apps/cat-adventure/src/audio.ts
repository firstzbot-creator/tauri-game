export type SfxName = 'meow' | 'chime' | 'rustle' | 'discovery'
  | 'player-attack' | 'boss-hit' | 'player-hit' | 'victory-jingle' | 'defeat-sound';

export type AudioManagerConfig = {
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
};

export type AudioManager = {
  startMusic(): void;
  stopMusic(): void;
  playSfx(name: SfxName): void;
  toggleMute(): boolean;
  isMuted(): boolean;
};

export const MUSIC_VOLUME = 0.35;
export const SFX_VOLUME = 0.6;
export const MUTE_STORAGE_KEY = 'cat-adventure-muted';

const VALID_SFX: ReadonlySet<string> = new Set<SfxName>(['meow', 'chime', 'rustle', 'discovery', 'player-attack', 'boss-hit', 'player-hit', 'victory-jingle', 'defeat-sound']);

export function loadMutePreference(): boolean {
  const stored = localStorage.getItem(MUTE_STORAGE_KEY);
  return stored === 'true';
}

export function saveMutePreference(muted: boolean): void {
  localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
}

export function createAudioManager(config: AudioManagerConfig): AudioManager {
  let muted = config.muted;
  let musicElement: HTMLAudioElement | undefined;
  const sfxCache = new Map<string, HTMLAudioElement>();

  function loadAudio(src: string): HTMLAudioElement | undefined {
    try {
      const audio = new Audio(src);
      return audio;
    } catch (e) {
      console.warn(`[audio] Failed to load audio: ${src}`, e instanceof Error ? e.message : String(e));
      return undefined;
    }
  }

  function initMusic(): void {
    if (musicElement !== undefined) return;
    musicElement = loadAudio(new URL('./assets/audio/music.mp3', import.meta.url).href);
    if (musicElement !== undefined) {
      musicElement.loop = true;
      musicElement.volume = muted ? 0 : config.musicVolume;
    }
  }

  function initSfx(): void {
    const sfxNames: SfxName[] = ['meow', 'chime', 'rustle', 'discovery', 'player-attack', 'boss-hit', 'player-hit', 'victory-jingle', 'defeat-sound'];
    for (const name of sfxNames) {
      try {
        const audio = loadAudio(new URL(`./assets/audio/${name}.mp3`, import.meta.url).href);
        if (audio !== undefined) {
          audio.volume = config.sfxVolume;
          sfxCache.set(name, audio);
        }
      } catch (e) {
        console.warn(`[audio] Failed to pre-load SFX: ${name}`, e instanceof Error ? e.message : String(e));
      }
    }
  }

  return {
    startMusic(): void {
      initMusic();
      initSfx();
      if (musicElement !== undefined && !muted) {
        musicElement.play().catch((e: unknown) => {
          console.warn('[audio] Music play failed:', e instanceof Error ? e.message : String(e));
        });
      }
    },

    stopMusic(): void {
      if (musicElement !== undefined) {
        musicElement.pause();
        musicElement.currentTime = 0;
      }
    },

    playSfx(name: SfxName): void {
      if (!VALID_SFX.has(name)) {
        console.warn(`[audio] Unknown SFX name: ${name}`);
        return;
      }
      if (muted) return;
      const cached = sfxCache.get(name);
      if (cached === undefined) {
        console.warn(`[audio] SFX not loaded: ${name}`);
        return;
      }
      const clone = cached.cloneNode(true) as HTMLAudioElement;
      clone.volume = muted ? 0 : config.sfxVolume;
      clone.play().catch((e: unknown) => {
        console.warn(`[audio] SFX play failed: ${name}`, e instanceof Error ? e.message : String(e));
      });
    },

    toggleMute(): boolean {
      muted = !muted;
      saveMutePreference(muted);
      if (musicElement !== undefined) {
        musicElement.volume = muted ? 0 : config.musicVolume;
        if (muted) {
          musicElement.pause();
        } else {
          musicElement.play().catch((e: unknown) => {
            console.warn('[audio] Music resume failed:', e instanceof Error ? e.message : String(e));
          });
        }
      }
      return muted;
    },

    isMuted(): boolean {
      return muted;
    },
  };
}
