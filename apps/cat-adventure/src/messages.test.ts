import { describe, it, expect } from 'vitest';
import { getRandomMessage, MESSAGE_POOLS } from './messages.js';
import type { ObjectType } from './objects.js';

const ALL_TYPES: ObjectType[] = ['mushroom', 'stone', 'acorn', 'feather', 'flower', 'seashell', 'pinecone', 'berry'];

describe('getRandomMessage', () => {
  it('returns a string from the provided pool', () => {
    const pool = ['hello', 'world', 'test'];
    const msg = getRandomMessage(pool);
    expect(pool).toContain(msg);
  });

  it('does not return undefined for non-empty pool', () => {
    const pool = ['one'];
    const msg = getRandomMessage(pool);
    expect(msg).toBeDefined();
    expect(typeof msg).toBe('string');
  });
});

describe('MESSAGE_POOLS', () => {
  it('has entries for all ObjectType values', () => {
    for (const type of ALL_TYPES) {
      expect(MESSAGE_POOLS[type]).toBeDefined();
    }
  });

  it('each pool has at least 3 firstDiscovery messages', () => {
    for (const type of ALL_TYPES) {
      const pool = MESSAGE_POOLS[type];
      expect(pool.firstDiscovery.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('each pool has at least 2 revisit messages', () => {
    for (const type of ALL_TYPES) {
      const pool = MESSAGE_POOLS[type];
      expect(pool.revisit.length).toBeGreaterThanOrEqual(2);
    }
  });
});
