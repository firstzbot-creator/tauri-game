import { invoke } from '@tauri-apps/api/core';
import type { CatState } from './state.js';

export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

type SaveData = {
  gameId: string;
  state: CatState;
};

export async function saveGameState(payload: SaveData): Promise<Result<void>> {
  try {
    const res = await invoke<Result<void>>('save_game_state', payload);
    return res;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export async function loadGameState(payload: { gameId: string }): Promise<Result<CatState>> {
  try {
    const res = await invoke<Result<CatState>>('load_game_state', payload);
    return res;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

