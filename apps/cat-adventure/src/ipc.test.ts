import { describe, it, expect } from 'vitest';
import { saveGameState, loadGameState } from './ipc.js';
import type { CatState } from './state.js';

describe('IPC Mock', () => {
  it('save_game_state returns success Result', async () => {
    const state: CatState = { position: { x: 5, y: 5 }, equippedHat: 'wizard' };
    const result = await saveGameState({ gameId: 'cat-adventure', state });
    expect(result.ok).toBe(true);
  });

  it('load_game_state returns previously saved state Result', async () => {
    const state: CatState = { position: { x: 5, y: 5 }, equippedHat: 'wizard' };
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
