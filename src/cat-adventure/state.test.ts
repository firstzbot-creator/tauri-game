import { describe, it, expect } from 'vitest';
import { updatePosition } from './state.js';
import type { CatState } from './state.js';

describe('CatState Movement', () => {
  it('updates position based on directional input', () => {
    const initialState: CatState = { position: { x: 0, y: 0 }, equippedHat: 'none' };
    
    // Move Right
    let newState = updatePosition(initialState, 'RIGHT');
    expect(newState.position.x).toBe(1);
    expect(newState.position.y).toBe(0);

    // Move Down
    newState = updatePosition(newState, 'DOWN');
    expect(newState.position.x).toBe(1);
    expect(newState.position.y).toBe(1);

    // Move Left
    newState = updatePosition(newState, 'LEFT');
    expect(newState.position.x).toBe(0);
    expect(newState.position.y).toBe(1);

    // Move Up
    newState = updatePosition(newState, 'UP');
    expect(newState.position.x).toBe(0);
    expect(newState.position.y).toBe(0);
  });

  it('clamps position to boundaries (e.g. 0 to 10)', () => {
    const state: CatState = { position: { x: 0, y: 0 }, equippedHat: 'none' };
    const leftState = updatePosition(state, 'LEFT');
    expect(leftState.position.x).toBe(0); // Should not go negative

    const  topState = updatePosition(state, 'UP');
    expect(topState.position.y).toBe(0); // Should not go negative
  });
});
