import { describe, it, expect } from 'vitest';
import { generateObjects, checkCollision } from './objects.js';
import type { FieldObject } from './objects.js';
import { FIELD_WIDTH, FIELD_HEIGHT } from './state.js';

describe('generateObjects', () => {
  it('returns requested count with positions within field bounds', () => {
    const objs = generateObjects(6, FIELD_WIDTH, FIELD_HEIGHT, []);
    expect(objs).toHaveLength(6);
    for (const obj of objs) {
      expect(obj.position.x).toBeGreaterThanOrEqual(0);
      expect(obj.position.x).toBeLessThanOrEqual(FIELD_WIDTH);
      expect(obj.position.y).toBeGreaterThanOrEqual(0);
      expect(obj.position.y).toBeLessThanOrEqual(FIELD_HEIGHT);
    }
  });

  it('maintains minimum spacing between objects', () => {
    const objs = generateObjects(8, FIELD_WIDTH, FIELD_HEIGHT, []);
    const MIN_SPACING = 40;
    for (let i = 0; i < objs.length; i++) {
      for (let j = i + 1; j < objs.length; j++) {
        const a = objs[i];
        const b = objs[j];
        if (a === undefined || b === undefined) continue;
        const dx = a.position.x - b.position.x;
        const dy = a.position.y - b.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        expect(dist).toBeGreaterThanOrEqual(MIN_SPACING);
      }
    }
  });

  it('avoids exclude zones', () => {
    const excludeZone = { x: 400, y: 300 };
    const objs = generateObjects(8, FIELD_WIDTH, FIELD_HEIGHT, [excludeZone]);
    const EXCLUDE_RADIUS = 80;
    for (const obj of objs) {
      const dx = obj.position.x - excludeZone.x;
      const dy = obj.position.y - excludeZone.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      expect(dist).toBeGreaterThanOrEqual(EXCLUDE_RADIUS);
    }
  });

  it('assigns unique IDs to each object', () => {
    const objs = generateObjects(6, FIELD_WIDTH, FIELD_HEIGHT, []);
    const ids = new Set(objs.map(o => o.id));
    expect(ids.size).toBe(6);
  });

  it('all objects start as undiscovered', () => {
    const objs = generateObjects(5, FIELD_WIDTH, FIELD_HEIGHT, []);
    for (const obj of objs) {
      expect(obj.discovered).toBe(false);
    }
  });
});

describe('checkCollision', () => {
  it('returns true when bounding boxes overlap', () => {
    const obj: FieldObject = {
      id: 'obj-0',
      type: 'mushroom',
      position: { x: 100, y: 100 },
      discovered: false,
    };
    // Cat at (90, 90) with size 64 overlaps object at (100, 100) with size 32
    expect(checkCollision({ x: 90, y: 90 }, 64, obj, 32)).toBe(true);
  });

  it('returns false when bounding boxes do not overlap', () => {
    const obj: FieldObject = {
      id: 'obj-0',
      type: 'stone',
      position: { x: 300, y: 300 },
      discovered: false,
    };
    expect(checkCollision({ x: 0, y: 0 }, 64, obj, 32)).toBe(false);
  });

  it('returns true on exact boundary touch', () => {
    const obj: FieldObject = {
      id: 'obj-0',
      type: 'acorn',
      position: { x: 64, y: 0 },
      discovered: false,
    };
    // Cat at (0, 0) size 64, object at (64, 0) size 32 — edges touch
    expect(checkCollision({ x: 0, y: 0 }, 64, obj, 32)).toBe(true);
  });

  it('returns false when just barely not touching', () => {
    const obj: FieldObject = {
      id: 'obj-0',
      type: 'feather',
      position: { x: 65, y: 0 },
      discovered: false,
    };
    expect(checkCollision({ x: 0, y: 0 }, 64, obj, 32)).toBe(false);
  });
});
