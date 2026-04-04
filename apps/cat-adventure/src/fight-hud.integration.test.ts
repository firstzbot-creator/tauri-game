// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { createFightState, applyDamage } from './combat.js';
import { renderFightHUD, updateHealthBars } from './fight-hud.js';
import type { FightState } from './fight-types.js';

const PLAYER_START = { x: 100, y: 100 };
const BOSS_SPAWN = { x: 600, y: 420 };

describe('Fight HUD rendering', () => {
  it('renders and updates health bars correctly during combat', () => {
    const container = document.createElement('div');
    const state = createFightState(PLAYER_START, BOSS_SPAWN);
    const fightingState: FightState = { ...state, phase: 'fighting' };

    renderFightHUD(container, fightingState);

    // Verify initial state
    const playerFill = container.querySelector('.player-hp-fill') as HTMLElement;
    const bossFill = container.querySelector('.boss-hp-fill') as HTMLElement;

    expect(playerFill).not.toBeNull();
    expect(bossFill).not.toBeNull();
    expect(playerFill.style.width).toBe('100%');
    expect(bossFill.style.width).toBe('100%');

    // Simulate damage
    const damagedState: FightState = {
      ...fightingState,
      playerEntity: applyDamage(fightingState.playerEntity, 20),
      boss: {
        ...fightingState.boss,
        entity: applyDamage(fightingState.boss.entity, 30),
      },
    };

    updateHealthBars(container, damagedState);

    // Player: 30/50 = 60%
    expect(playerFill.style.width).toBe('60%');
    // Boss: 50/80 = 62.5%
    expect(bossFill.style.width).toBe('62.5%');
  });

  it('renders fight status text only in fighting phase', () => {
    const container = document.createElement('div');
    const exploringState = createFightState(PLAYER_START, BOSS_SPAWN);

    renderFightHUD(container, exploringState);
    expect(container.querySelector('.fight-status-text')).toBeNull();

    const container2 = document.createElement('div');
    const fightingState: FightState = { ...exploringState, phase: 'fighting' };

    renderFightHUD(container2, fightingState);
    expect(container2.querySelector('.fight-status-text')).not.toBeNull();
  });
});
