import { describe, it, expect } from 'vitest';
import { updatePosition, moveToward, clampPosition, FIELD_WIDTH, FIELD_HEIGHT, CAT_SIZE, STEP_SIZE } from './state.js';
import type { CatState } from './state.js';

describe('updatePosition (pixel-based)', () => {
  const base: CatState = { position: { x: 400, y: 300 }, facing: 'right', equippedHat: 'wizard' };

  it('moves right by STEP_SIZE pixels', () => {
    const next = updatePosition(base, 'RIGHT');
    expect(next.position.x).toBe(400 + STEP_SIZE);
    expect(next.position.y).toBe(300);
    expect(next.facing).toBe('right');
  });

  it('moves left by STEP_SIZE pixels', () => {
    const next = updatePosition(base, 'LEFT');
    expect(next.position.x).toBe(400 - STEP_SIZE);
    expect(next.facing).toBe('left');
  });

  it('moves up by STEP_SIZE pixels', () => {
    const next = updatePosition(base, 'UP');
    expect(next.position.y).toBe(300 - STEP_SIZE);
  });

  it('moves down by STEP_SIZE pixels', () => {
    const next = updatePosition(base, 'DOWN');
    expect(next.position.y).toBe(300 + STEP_SIZE);
  });

  it('clamps to left boundary (x >= 0)', () => {
    const atEdge: CatState = { ...base, position: { x: 10, y: 300 } };
    const next = updatePosition(atEdge, 'LEFT');
    expect(next.position.x).toBe(0);
  });

  it('clamps to right boundary (x <= FIELD_WIDTH - CAT_SIZE)', () => {
    const atEdge: CatState = { ...base, position: { x: FIELD_WIDTH - CAT_SIZE - 10, y: 300 } };
    const next = updatePosition(atEdge, 'RIGHT');
    expect(next.position.x).toBe(FIELD_WIDTH - CAT_SIZE);
  });

  it('clamps to top boundary (y >= 0)', () => {
    const atEdge: CatState = { ...base, position: { x: 400, y: 10 } };
    const next = updatePosition(atEdge, 'UP');
    expect(next.position.y).toBe(0);
  });

  it('clamps to bottom boundary (y <= FIELD_HEIGHT - CAT_SIZE)', () => {
    const atEdge: CatState = { ...base, position: { x: 400, y: FIELD_HEIGHT - CAT_SIZE - 10 } };
    const next = updatePosition(atEdge, 'DOWN');
    expect(next.position.y).toBe(FIELD_HEIGHT - CAT_SIZE);
  });
});

describe('clampPosition', () => {
  it('returns position unchanged when within bounds', () => {
    const pos = clampPosition({ x: 100, y: 200 }, FIELD_WIDTH, FIELD_HEIGHT, CAT_SIZE);
    expect(pos).toEqual({ x: 100, y: 200 });
  });

  it('clamps negative x to 0', () => {
    const pos = clampPosition({ x: -50, y: 200 }, FIELD_WIDTH, FIELD_HEIGHT, CAT_SIZE);
    expect(pos.x).toBe(0);
  });

  it('clamps x exceeding field width', () => {
    const pos = clampPosition({ x: 900, y: 200 }, FIELD_WIDTH, FIELD_HEIGHT, CAT_SIZE);
    expect(pos.x).toBe(FIELD_WIDTH - CAT_SIZE);
  });

  it('clamps negative y to 0', () => {
    const pos = clampPosition({ x: 100, y: -30 }, FIELD_WIDTH, FIELD_HEIGHT, CAT_SIZE);
    expect(pos.y).toBe(0);
  });

  it('clamps y exceeding field height', () => {
    const pos = clampPosition({ x: 100, y: 700 }, FIELD_WIDTH, FIELD_HEIGHT, CAT_SIZE);
    expect(pos.y).toBe(FIELD_HEIGHT - CAT_SIZE);
  });
});

describe('moveToward', () => {
  const base: CatState = { position: { x: 100, y: 100 }, facing: 'right', equippedHat: 'wizard' };

  it('moves cat closer to target position', () => {
    const target = { x: 300, y: 100 };
    const next = moveToward(base, target, STEP_SIZE);
    expect(next.position.x).toBeGreaterThan(100);
    expect(next.position.x).toBeLessThan(300);
  });

  it('updates facing to right when moving right', () => {
    const target = { x: 300, y: 100 };
    const next = moveToward(base, target, STEP_SIZE);
    expect(next.facing).toBe('right');
  });

  it('updates facing to left when moving left', () => {
    const target = { x: 0, y: 100 };
    const next = moveToward(base, target, STEP_SIZE);
    expect(next.facing).toBe('left');
  });

  it('stops at target when within one step', () => {
    const target = { x: 110, y: 105 };
    const next = moveToward(base, target, STEP_SIZE);
    expect(next.position).toEqual(target);
  });

  it('clamps result to field boundaries', () => {
    const atEdge: CatState = { ...base, position: { x: FIELD_WIDTH - 10, y: 300 } };
    const target = { x: FIELD_WIDTH + 100, y: 300 };
    const next = moveToward(atEdge, target, STEP_SIZE);
    expect(next.position.x).toBeLessThanOrEqual(FIELD_WIDTH - CAT_SIZE);
  });

  it('returns current position when already at target', () => {
    const target = { x: 100, y: 100 };
    const next = moveToward(base, target, STEP_SIZE);
    expect(next.position).toEqual({ x: 100, y: 100 });
  });
});
