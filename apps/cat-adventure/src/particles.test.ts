// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { showSparkles } from './particles.js';

describe('showSparkles', () => {
  it('creates child elements at the specified position', () => {
    const container = document.createElement('div');
    showSparkles(container, { x: 100, y: 200 });
    const sparkles = container.querySelectorAll('.sparkle');
    expect(sparkles.length).toBeGreaterThanOrEqual(5);
  });

  it('sparkle elements have absolute positioning', () => {
    const container = document.createElement('div');
    showSparkles(container, { x: 50, y: 50 });
    const sparkle = container.querySelector('.sparkle') as HTMLElement | null;
    expect(sparkle).not.toBeNull();
    expect(sparkle?.style.position).toBe('absolute');
  });
});
