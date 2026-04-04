// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { flashElement, shakeField, showVictoryParticles, showAttackLunge, showDefeatOverlay, removeDefeatOverlay } from './fight-effects.js';

describe('flashElement', () => {
  it('adds hit-flash class to element and removes it after duration', () => {
    vi.useFakeTimers();
    const el = document.createElement('div');

    flashElement(el, 200);

    expect(el.classList.contains('hit-flash')).toBe(true);

    vi.advanceTimersByTime(200);

    expect(el.classList.contains('hit-flash')).toBe(false);
    vi.useRealTimers();
  });
});

describe('shakeField', () => {
  it('adds shake class to field and removes it after duration', () => {
    vi.useFakeTimers();
    const field = document.createElement('div');

    shakeField(field, 300);

    expect(field.classList.contains('screen-shake')).toBe(true);

    vi.advanceTimersByTime(300);

    expect(field.classList.contains('screen-shake')).toBe(false);
    vi.useRealTimers();
  });
});

describe('showAttackLunge', () => {
  it('adds lunge class to element and removes it after duration', () => {
    vi.useFakeTimers();
    const el = document.createElement('div');

    showAttackLunge(el, 150);

    expect(el.classList.contains('cat-lunge')).toBe(true);

    vi.advanceTimersByTime(150);

    expect(el.classList.contains('cat-lunge')).toBe(false);
    vi.useRealTimers();
  });
});

describe('showVictoryParticles', () => {
  it('creates golden sparkle elements at the given position', () => {
    const container = document.createElement('div');
    const position = { x: 400, y: 300 };

    showVictoryParticles(container, position);

    const sparkles = container.querySelectorAll('.victory-sparkle');
    expect(sparkles.length).toBeGreaterThan(0);
  });
});

describe('showDefeatOverlay', () => {
  it('creates defeat overlay with message and retry button', () => {
    const container = document.createElement('div');

    showDefeatOverlay(container);

    const overlay = container.querySelector('.defeat-overlay');
    expect(overlay).not.toBeNull();

    const message = container.querySelector('.defeat-message');
    expect(message?.textContent).toContain('So Close');

    const button = container.querySelector<HTMLButtonElement>('.defeat-retry-button');
    expect(button).not.toBeNull();
    expect(button?.textContent).toBe('Try Again');
  });
});

describe('removeDefeatOverlay', () => {
  it('removes the defeat overlay from container', () => {
    const container = document.createElement('div');
    showDefeatOverlay(container);

    removeDefeatOverlay(container);

    const overlay = container.querySelector('.defeat-overlay');
    expect(overlay).toBeNull();
  });
});
