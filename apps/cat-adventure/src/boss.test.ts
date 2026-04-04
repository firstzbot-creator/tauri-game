import { describe, it, expect } from 'vitest';
import { createBoss, markBossDefeated } from './boss.js';
import type { Position } from './state.js';

const BOSS_SPAWN: Position = { x: 600, y: 420 };

describe('createBoss', () => {
  it('creates boss at specified position with correct initial state', () => {
    const boss = createBoss('coyote', BOSS_SPAWN);

    expect(boss.id).toBe('coyote');
    expect(boss.position).toEqual(BOSS_SPAWN);
    expect(boss.spawnPosition).toEqual(BOSS_SPAWN);
    expect(boss.entity.hp).toBe(80);
    expect(boss.entity.maxHp).toBe(80);
    expect(boss.entity.attackDamage).toBe(5);
    expect(boss.entity.attackCooldownMs).toBe(1500);
    expect(boss.defeated).toBe(false);
    expect(boss.behavior).toBe('idle');
    expect(boss.size).toBe(64);
  });
});

describe('markBossDefeated', () => {
  it('marks boss as defeated', () => {
    const boss = createBoss('coyote', BOSS_SPAWN);
    const defeated = markBossDefeated(boss);

    expect(defeated.defeated).toBe(true);
    expect(defeated.entity.hp).toBe(0);
  });
});
