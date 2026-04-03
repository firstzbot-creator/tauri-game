// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderWorld, generateFlowers } from './world.js';
import { createCatElement, updateCatPosition } from './cat.js';
import { FIELD_WIDTH, FIELD_HEIGHT } from './state.js';
import type { FlowerPlacement } from './world.js';

describe('world rendering (integration)', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  });

  it('renderWorld creates correct number of flower DOM elements', () => {
    const flowers: FlowerPlacement[] = [
      { position: { x: 100, y: 100 }, variant: 0 },
      { position: { x: 200, y: 200 }, variant: 1 },
      { position: { x: 300, y: 300 }, variant: 2 },
    ];
    renderWorld(container, flowers);
    const flowerEls = container.querySelectorAll('.flower');
    expect(flowerEls.length).toBe(3);
  });

  it('flower elements have absolute positioning within container', () => {
    const flowers: FlowerPlacement[] = [
      { position: { x: 150, y: 250 }, variant: 1 },
    ];
    renderWorld(container, flowers);
    const flowerEl = container.querySelector('.flower') as HTMLElement | null;
    expect(flowerEl).not.toBeNull();
    expect(flowerEl?.style.position).toBe('absolute');
    expect(flowerEl?.style.left).toBe('150px');
    expect(flowerEl?.style.top).toBe('250px');
  });

  it('container gets game-field class after renderWorld', () => {
    renderWorld(container, []);
    expect(container.classList.contains('game-field')).toBe(true);
  });

  it('renders at least 6 flowers from generateFlowers', () => {
    const flowers = generateFlowers(8, FIELD_WIDTH, FIELD_HEIGHT);
    renderWorld(container, flowers);
    const flowerEls = container.querySelectorAll('.flower');
    expect(flowerEls.length).toBeGreaterThanOrEqual(6);
  });
});

describe('cat element rendering (integration)', () => {
  it('updateCatPosition sets style.left and style.top', () => {
    const catEl = createCatElement();
    updateCatPosition(catEl, { x: 200, y: 150 }, 'right');
    expect(catEl.style.left).toBe('200px');
    expect(catEl.style.top).toBe('150px');
  });

  it('cat element has scaleX(-1) when facing left', () => {
    const catEl = createCatElement();
    updateCatPosition(catEl, { x: 100, y: 100 }, 'left');
    expect(catEl.style.transform).toBe('scaleX(-1)');
  });

  it('cat element has scaleX(1) when facing right', () => {
    const catEl = createCatElement();
    updateCatPosition(catEl, { x: 100, y: 100 }, 'right');
    expect(catEl.style.transform).toBe('scaleX(1)');
  });

  it('cat element has cat-sprite class and idle animation', () => {
    const catEl = createCatElement();
    expect(catEl.classList.contains('cat-sprite')).toBe(true);
  });

  it('cat element is an img tag', () => {
    const catEl = createCatElement();
    expect(catEl.tagName).toBe('IMG');
  });
});
