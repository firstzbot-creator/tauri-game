import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { CatState } from './state.js';

const store = new Map<string, unknown>();

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(async (cmd: string, args?: Record<string, unknown>) => {
    if (cmd === 'save_game_state') {
      const { gameId, state } = args as { gameId: string; state: unknown };
      store.set(gameId, state);
      return { ok: true, value: undefined };
    }
    if (cmd === 'load_game_state') {
      const { gameId } = args as { gameId: string };
      const saved = store.get(gameId);
      if (saved === undefined) {
        return { ok: false, error: new Error(`load_game_state: no state for gameId=${gameId}`) };
      }
      return { ok: true, value: saved };
    }
    throw new Error(`Unknown command: ${cmd}`);
  }),
}));

import { saveGameState, loadGameState } from './ipc.js';

describe('IPC Mock', () => {
  beforeEach(() => {
    store.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('save_game_state returns success Result', async () => {
    const state: CatState = { position: { x: 5, y: 5 }, facing: 'right', equippedHat: 'wizard' };
    const result = await saveGameState({ gameId: 'cat-adventure', state });
    expect(result.ok).toBe(true);
  });

  it('load_game_state returns previously saved state Result', async () => {
    const state: CatState = { position: { x: 5, y: 5 }, facing: 'right', equippedHat: 'wizard' };
    await saveGameState({ gameId: 'cat-adventure', state });
    const result = await loadGameState({ gameId: 'cat-adventure' });
    expect(result.ok).toBe(true);
    if (result.ok) {
        expect(result.value.equippedHat).toBe('wizard');
        expect(result.value.position.x).toBe(5);
    }
  });

  it('load_game_state returns error when no state is saved', async () => {
    const result = await loadGameState({ gameId: 'unknown' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeDefined();
    }
  });
});
