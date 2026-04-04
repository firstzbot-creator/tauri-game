// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { createFightState, calculateAttack, applyDamage, checkPhaseTransition, checkFlee, resetFightState } from './combat.js';
import { updateBossAI, resetBossToSpawn } from './boss-ai.js';
import { markBossDefeated } from './boss.js';
import type { FightState } from './fight-types.js';
import type { Position } from './state.js';

const PLAYER_START: Position = { x: 100, y: 100 };
const BOSS_SPAWN: Position = { x: 600, y: 420 };
const PLAYER_ATTACK_RANGE = 70;
const BOSS_ENGAGEMENT_RANGE = 120;

describe('Fight flow: approach -> fight -> victory', () => {
  it('player approaches boss, combat starts, player attacks until victory', () => {
    let state = createFightState(PLAYER_START, BOSS_SPAWN);
    expect(state.phase).toBe('exploring');

    // Player moves close to boss
    const nearBoss: Position = { x: BOSS_SPAWN.x - 60, y: BOSS_SPAWN.y };
    state = { ...state, phase: 'fighting' };
    expect(state.phase).toBe('fighting');

    // Player attacks boss repeatedly until it dies
    // Boss has 80 HP, player deals 10 damage per hit, cooldown 600ms
    let now = 0;
    while (state.boss.entity.hp > 0 && now < 100000) {
      const result = calculateAttack(
        state.playerEntity,
        state.boss.entity,
        nearBoss,
        state.boss.position,
        PLAYER_ATTACK_RANGE,
        now,
      );

      if (result.hit) {
        state = {
          ...state,
          playerEntity: { ...state.playerEntity, lastAttackTime: now },
          boss: {
            ...state.boss,
            entity: applyDamage(state.boss.entity, result.damage),
          },
        };

        const newPhase = checkPhaseTransition(state);
        if (newPhase !== state.phase) {
          state = { ...state, phase: newPhase };
        }
      }

      now += 700; // Advance past cooldown
    }

    expect(state.phase).toBe('victory');
    expect(state.boss.entity.hp).toBe(0);

    // Mark boss as defeated
    state = { ...state, boss: markBossDefeated(state.boss) };
    expect(state.boss.defeated).toBe(true);
  });
});

describe('Fight flow: approach -> fight -> defeat -> retry', () => {
  it('player takes enough damage to lose, retry resets state', () => {
    let state = createFightState(PLAYER_START, BOSS_SPAWN);
    // Simulate player near boss for attack range
    const nearBoss: Position = { x: BOSS_SPAWN.x - 50, y: BOSS_SPAWN.y };
    state = { ...state, phase: 'fighting' };

    // Boss deals damage to player until defeated
    // Player has 50 HP, boss deals 5 damage, cooldown 1500ms
    let now = 0;
    while (state.playerEntity.hp > 0 && now < 100000) {
      // Boss attacks
      const bossResult = calculateAttack(
        state.boss.entity,
        state.playerEntity,
        state.boss.position,
        nearBoss,
        70,
        now,
      );

      if (bossResult.hit) {
        state = {
          ...state,
          boss: {
            ...state.boss,
            entity: { ...state.boss.entity, lastAttackTime: now },
          },
          playerEntity: applyDamage(state.playerEntity, bossResult.damage),
        };

        const newPhase = checkPhaseTransition(state);
        if (newPhase !== state.phase) {
          state = { ...state, phase: newPhase };
        }
      }

      now += 1600; // Advance past boss cooldown
    }

    expect(state.phase).toBe('defeated');
    expect(state.playerEntity.hp).toBe(0);

    // Retry — reset state
    state = resetFightState(state, PLAYER_START, BOSS_SPAWN);
    expect(state.phase).toBe('exploring');
    expect(state.playerEntity.hp).toBe(50);
    expect(state.boss.entity.hp).toBe(80);
    expect(state.boss.defeated).toBe(false);
  });
});

describe('Boss AI + combat engine integration', () => {
  it('boss AI updates produce valid combat states', () => {
    const state = createFightState(PLAYER_START, BOSS_SPAWN);
    const fightingState: FightState = { ...state, phase: 'fighting' };

    const playerPos: Position = { x: 520, y: 420 }; // ~80px from boss — engagement range but not attack range
    const updated = updateBossAI(fightingState.boss, playerPos, 1000);

    expect(updated.behavior).toBe('approaching');
    // Boss should have moved toward player
    expect(updated.position.x).toBeLessThan(BOSS_SPAWN.x);
  });

  it('boss returns to spawn when player flees', () => {
    const state = createFightState(PLAYER_START, BOSS_SPAWN);
    const fightingState: FightState = {
      ...state,
      phase: 'fighting',
      boss: updateBossAI(state.boss, { x: 560, y: 420 }, 1000),
    };

    // Player moves far away
    const farPlayer: Position = { x: 100, y: 100 };
    expect(checkFlee(farPlayer, fightingState.boss.position)).toBe(true);

    const resetBoss = resetBossToSpawn(fightingState.boss);
    expect(resetBoss.position).toEqual(BOSS_SPAWN);
    expect(resetBoss.behavior).toBe('idle');
  });
});
