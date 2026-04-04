import { describe, it, expect } from 'vitest';
import { updateBossAI, resetBossToSpawn } from './boss-ai.js';
import type { BossState } from './fight-types.js';
import type { Position } from './state.js';

const BOSS_SPAWN: Position = { x: 600, y: 420 };

function makeBoss(overrides: Partial<BossState> = {}): BossState {
  return {
    id: 'coyote',
    position: { ...BOSS_SPAWN },
    spawnPosition: { ...BOSS_SPAWN },
    facing: 'left',
    size: 64,
    entity: {
      hp: 80,
      maxHp: 80,
      attackDamage: 5,
      attackCooldownMs: 1500,
      lastAttackTime: 0,
    },
    defeated: false,
    behavior: 'idle',
    ...overrides,
  };
}

describe('updateBossAI', () => {
  it('stays idle when player is far away', () => {
    const boss = makeBoss();
    const playerPos: Position = { x: 0, y: 0 };

    const result = updateBossAI(boss, playerPos, 1000);

    expect(result.behavior).toBe('idle');
    expect(result.position).toEqual(BOSS_SPAWN);
  });

  it('transitions to approaching when player enters engagement range', () => {
    const boss = makeBoss();
    const playerPos: Position = { x: 520, y: 380 }; // ~100px from boss

    const result = updateBossAI(boss, playerPos, 1000);

    expect(result.behavior).toBe('approaching');
  });

  it('moves toward player when approaching', () => {
    const boss = makeBoss({ behavior: 'approaching' });
    const playerPos: Position = { x: 500, y: 400 };

    const result = updateBossAI(boss, playerPos, 1000);

    // Boss should have moved toward player
    expect(result.position.x).toBeLessThan(BOSS_SPAWN.x);
    expect(result.behavior).toBe('approaching');
  });

  it('transitions to attacking when within attack range', () => {
    const boss = makeBoss({ behavior: 'approaching' });
    const playerPos: Position = { x: BOSS_SPAWN.x - 60, y: BOSS_SPAWN.y }; // ~60px away

    const result = updateBossAI(boss, playerPos, 1000);

    expect(result.behavior).toBe('attacking');
  });

  it('attacks when in attack range and off cooldown', () => {
    const boss = makeBoss({ behavior: 'attacking' });
    const playerPos: Position = { x: BOSS_SPAWN.x - 50, y: BOSS_SPAWN.y };

    const result = updateBossAI(boss, playerPos, 2000);

    // Boss should have attacked (lastAttackTime updated)
    expect(result.entity.lastAttackTime).toBe(2000);
  });

  it('does not attack during cooldown', () => {
    const boss = makeBoss({
      behavior: 'attacking',
      entity: {
        ...makeBoss().entity,
        lastAttackTime: 1000,
      },
    });
    const playerPos: Position = { x: BOSS_SPAWN.x - 50, y: BOSS_SPAWN.y };

    const result = updateBossAI(boss, playerPos, 1500);
    // 1500 - 1000 = 500ms elapsed, cooldown is 1500ms — should not attack

    expect(result.entity.lastAttackTime).toBe(1000); // unchanged
  });

  it('does nothing when defeated', () => {
    const boss = makeBoss({ defeated: true, behavior: 'idle' });
    const playerPos: Position = { x: BOSS_SPAWN.x - 10, y: BOSS_SPAWN.y };

    const result = updateBossAI(boss, playerPos, 1000);

    expect(result.behavior).toBe('idle');
    expect(result.position).toEqual(BOSS_SPAWN);
  });

  it('faces toward the player when approaching', () => {
    const boss = makeBoss({ behavior: 'approaching' });
    // Player is to the left
    const playerPos: Position = { x: 400, y: 420 };

    const result = updateBossAI(boss, playerPos, 1000);

    expect(result.facing).toBe('left');
  });
});

describe('resetBossToSpawn', () => {
  it('resets boss position to spawn point when combat disengages', () => {
    const boss = makeBoss({
      position: { x: 400, y: 300 },
      behavior: 'attacking',
    });

    const result = resetBossToSpawn(boss);

    expect(result.position).toEqual(BOSS_SPAWN);
    expect(result.behavior).toBe('idle');
  });
});
