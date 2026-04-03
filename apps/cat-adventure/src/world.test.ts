import { describe, it, expect } from 'vitest';
import { generateFlowers, FLOWER_PADDING } from './world.js';
import type { FlowerPlacement } from './world.js';
import { FIELD_WIDTH, FIELD_HEIGHT } from './state.js';

describe('generateFlowers', () => {
  it('returns the requested number of flowers', () => {
    const flowers = generateFlowers(8, FIELD_WIDTH, FIELD_HEIGHT);
    expect(flowers).toHaveLength(8);
  });

  it('places all flowers within field bounds', () => {
    const flowers = generateFlowers(10, FIELD_WIDTH, FIELD_HEIGHT);
    for (const f of flowers) {
      expect(f.position.x).toBeGreaterThanOrEqual(0);
      expect(f.position.x).toBeLessThanOrEqual(FIELD_WIDTH);
      expect(f.position.y).toBeGreaterThanOrEqual(0);
      expect(f.position.y).toBeLessThanOrEqual(FIELD_HEIGHT);
    }
  });

  it('applies padding so no flower is within FLOWER_PADDING px of field edge', () => {
    const flowers = generateFlowers(10, FIELD_WIDTH, FIELD_HEIGHT);
    for (const f of flowers) {
      expect(f.position.x).toBeGreaterThanOrEqual(FLOWER_PADDING);
      expect(f.position.x).toBeLessThanOrEqual(FIELD_WIDTH - FLOWER_PADDING);
      expect(f.position.y).toBeGreaterThanOrEqual(FLOWER_PADDING);
      expect(f.position.y).toBeLessThanOrEqual(FIELD_HEIGHT - FLOWER_PADDING);
    }
  });

  it('returns different positions on successive calls (randomness)', () => {
    const flowers1 = generateFlowers(6, FIELD_WIDTH, FIELD_HEIGHT);
    const flowers2 = generateFlowers(6, FIELD_WIDTH, FIELD_HEIGHT);
    // Very unlikely all 6 positions match
    const allMatch = flowers1.every((f, i) => {
      const other = flowers2[i];
      return other !== undefined && f.position.x === other.position.x && f.position.y === other.position.y;
    });
    expect(allMatch).toBe(false);
  });

  it('assigns variant numbers between 0 and 3', () => {
    const flowers = generateFlowers(10, FIELD_WIDTH, FIELD_HEIGHT);
    for (const f of flowers) {
      expect(f.variant).toBeGreaterThanOrEqual(0);
      expect(f.variant).toBeLessThanOrEqual(3);
    }
  });
});
