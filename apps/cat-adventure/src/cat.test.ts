import { describe, it, expect } from 'vitest';
import { calculateMoveTarget } from './cat.js';
import { FIELD_WIDTH, FIELD_HEIGHT, CAT_SIZE, STEP_SIZE } from './state.js';
import type { Position } from './state.js';

describe('calculateMoveTarget', () => {
  it('moves toward click target by step size', () => {
    const current: Position = { x: 100, y: 100 };
    const click: Position = { x: 300, y: 100 };
    const result = calculateMoveTarget(current, click, STEP_SIZE);
    expect(result.x).toBeGreaterThan(100);
    expect(result.x).toBeLessThan(300);
    // Should move exactly STEP_SIZE in x when y is same
    expect(result.x).toBeCloseTo(100 + STEP_SIZE, 5);
    expect(result.y).toBeCloseTo(100, 5);
  });

  it('moves diagonally toward click target', () => {
    const current: Position = { x: 100, y: 100 };
    const click: Position = { x: 200, y: 200 };
    const result = calculateMoveTarget(current, click, STEP_SIZE);
    expect(result.x).toBeGreaterThan(100);
    expect(result.y).toBeGreaterThan(100);
    // Distance moved should equal STEP_SIZE
    const dx = result.x - 100;
    const dy = result.y - 100;
    const dist = Math.sqrt(dx * dx + dy * dy);
    expect(dist).toBeCloseTo(STEP_SIZE, 5);
  });

  it('returns target when within one step', () => {
    const current: Position = { x: 100, y: 100 };
    const click: Position = { x: 110, y: 105 };
    const result = calculateMoveTarget(current, click, STEP_SIZE);
    expect(result).toEqual({ x: 110, y: 105 });
  });

  it('returns current position when already at target', () => {
    const current: Position = { x: 100, y: 100 };
    const result = calculateMoveTarget(current, current, STEP_SIZE);
    expect(result).toEqual(current);
  });

  it('clamps result to field boundaries', () => {
    const current: Position = { x: FIELD_WIDTH - 10, y: 300 };
    const click: Position = { x: FIELD_WIDTH + 100, y: 300 };
    const result = calculateMoveTarget(current, click, STEP_SIZE);
    expect(result.x).toBeLessThanOrEqual(FIELD_WIDTH - CAT_SIZE);
  });
});
