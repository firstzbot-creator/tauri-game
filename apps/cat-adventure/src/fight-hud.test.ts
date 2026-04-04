// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { createFightState } from './combat.js';
import { renderFightHUD, updateHealthBars } from './fight-hud.js';
import type { FightState } from './fight-types.js';

const PLAYER_START = { x: 100, y: 100 };
const BOSS_SPAWN = { x: 600, y: 420 };

describe('renderFightHUD', () => {
  it('creates health bar DOM elements in the container', () => {
    const container = document.createElement('div');
    const state = createFightState(PLAYER_START, BOSS_SPAWN);

    renderFightHUD(container, state);

    const playerBar = container.querySelector('.player-hp-bar');
    const bossBar = container.querySelector('.boss-hp-bar');

    expect(playerBar).not.toBeNull();
    expect(bossBar).not.toBeNull();
  });

  it('shows fight status text when in fighting phase', () => {
    const container = document.createElement('div');
    const state: FightState = {
      ...createFightState(PLAYER_START, BOSS_SPAWN),
      phase: 'fighting',
    };

    renderFightHUD(container, state);

    const statusText = container.querySelector('.fight-status-text');
    expect(statusText).not.toBeNull();
    expect(statusText?.textContent).toBe('FIGHT!');
  });
});

describe('updateHealthBars', () => {
  it('updates health bar widths based on current HP', () => {
    const container = document.createElement('div');
    const state = createFightState(PLAYER_START, BOSS_SPAWN);
    renderFightHUD(container, state);

    const damagedState: FightState = {
      ...state,
      playerEntity: { ...state.playerEntity, hp: 25 },
      boss: {
        ...state.boss,
        entity: { ...state.boss.entity, hp: 40 },
      },
    };

    updateHealthBars(container, damagedState);

    const playerFill = container.querySelector('.player-hp-fill') as HTMLElement;
    const bossFill = container.querySelector('.boss-hp-fill') as HTMLElement;

    expect(playerFill).not.toBeNull();
    expect(bossFill).not.toBeNull();
    // 25/50 = 50%
    expect(playerFill.style.width).toBe('50%');
    // 40/80 = 50%
    expect(bossFill.style.width).toBe('50%');
  });
});
