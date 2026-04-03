import type { CatState } from './state.js';

export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

type SaveData = {
  gameId: string;
  state: CatState;
};

// In-memory store for mocks
export const mockStore = new Map<string, CatState>();

export async function saveGameState(payload: SaveData): Promise<Result<void>> {
  try {
    mockStore.set(payload.gameId, payload.state);
    return { ok: true, value: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export async function loadGameState(payload: { gameId: string }): Promise<Result<CatState>> {
  try {
    const state = mockStore.get(payload.gameId);
    if (!state) {
      return { ok: false, error: new Error('State not found for gameId: ' + payload.gameId) };
    }
    return { ok: true, value: state };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
