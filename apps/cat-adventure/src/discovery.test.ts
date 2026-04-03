import { describe, it, expect } from 'vitest';
import { createDiscoveryState, recordDiscovery, isDiscovered } from './discovery.js';

describe('createDiscoveryState', () => {
  it('returns state with count 0 and empty set', () => {
    const state = createDiscoveryState();
    expect(state.count).toBe(0);
    expect(state.discoveredIds.size).toBe(0);
  });
});

describe('recordDiscovery', () => {
  it('increments count and adds ID to set', () => {
    const state = createDiscoveryState();
    const next = recordDiscovery(state, 'obj-0');
    expect(next.count).toBe(1);
    expect(next.discoveredIds.has('obj-0')).toBe(true);
  });

  it('with already-discovered ID does not increment count', () => {
    let state = createDiscoveryState();
    state = recordDiscovery(state, 'obj-0');
    const next = recordDiscovery(state, 'obj-0');
    expect(next.count).toBe(1);
  });

  it('increments for each new unique discovery', () => {
    let state = createDiscoveryState();
    state = recordDiscovery(state, 'obj-0');
    state = recordDiscovery(state, 'obj-1');
    state = recordDiscovery(state, 'obj-2');
    expect(state.count).toBe(3);
  });
});

describe('isDiscovered', () => {
  it('returns true for known IDs', () => {
    let state = createDiscoveryState();
    state = recordDiscovery(state, 'obj-0');
    expect(isDiscovered(state, 'obj-0')).toBe(true);
  });

  it('returns false for unknown IDs', () => {
    const state = createDiscoveryState();
    expect(isDiscovered(state, 'obj-99')).toBe(false);
  });
});
