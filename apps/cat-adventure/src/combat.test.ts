import { describe, it, expect } from 'vitest';
import type { CombatEntity, CombatPhase, FightState, AttackResult } from './fight-types.js';
import { createCombatEntity, calculateAttack, applyDamage, checkPhaseTransition, checkFlee, createFightState, resetFightState } from './combat.js';
import type { Position } from './state.js';

const PLAYER_START: Position = { x: 100, y: 100 };
const BOSS_SPAWN: Position = { x: 600, y: 420 };

function makeEntity(hp: number, maxHp: number, damage: number, cooldownMs: number): CombatEntity {
  return {
    hp,
    maxHp,
    attackDamage: damage,
    attackCooldownMs: cooldownMs,
    lastAttackTime: 0,
  };
}

describe('createCombatEntity', () => {
  it('creates entity with correct hp, damage, and cooldown', () => {
    const entity = createCombatEntity(50, 10, 600);
    expect(entity.hp).toBe(50);
    expect(entity.maxHp).toBe(50);
    expect(entity.attackDamage).toBe(10);
    expect(entity.attackCooldownMs).toBe(600);
    expect(entity.lastAttackTime).toBe(0);
  });
});

describe('calculateAttack', () => {
  it('returns hit true with correct damage when in range and off cooldown', () => {
    const attacker = makeEntity(50, 50, 10, 600);
    const defender = makeEntity(80, 80, 5, 1500);
    const attackerPos: Position = { x: 100, y: 100 };
    const defenderPos: Position = { x: 130, y: 100 }; // 30px away

    const result = calculateAttack(attacker, defender, attackerPos, defenderPos, 70, 1000);

    expect(result.hit).toBe(true);
    expect(result.damage).toBe(10);
    expect(result.attackerPosition).toEqual(attackerPos);
    expect(result.defenderPosition).toEqual(defenderPos);
    expect(result.timestamp).toBe(1000);
  });

  it('returns hit false when out of range', () => {
    const attacker = makeEntity(50, 50, 10, 600);
    const defender = makeEntity(80, 80, 5, 1500);
    const attackerPos: Position = { x: 0, y: 0 };
    const defenderPos: Position = { x: 200, y: 0 }; // 200px away, range 70

    const result = calculateAttack(attacker, defender, attackerPos, defenderPos, 70, 1000);

    expect(result.hit).toBe(false);
  });

  it('returns hit false when on cooldown', () => {
    const attacker = makeEntity(50, 50, 10, 600);
    attacker.lastAttackTime = 800;
    const defender = makeEntity(80, 80, 5, 1500);
    const attackerPos: Position = { x: 100, y: 100 };
    const defenderPos: Position = { x: 130, y: 100 };

    const result = calculateAttack(attacker, defender, attackerPos, defenderPos, 70, 1000);
    // 1000 - 800 = 200ms elapsed, cooldown is 600ms

    expect(result.hit).toBe(false);
  });

  it('allows attack when cooldown has elapsed', () => {
    const attacker = makeEntity(50, 50, 10, 600);
    attacker.lastAttackTime = 300;
    const defender = makeEntity(80, 80, 5, 1500);
    const attackerPos: Position = { x: 100, y: 100 };
    const defenderPos: Position = { x: 130, y: 100 };

    const result = calculateAttack(attacker, defender, attackerPos, defenderPos, 70, 1000);
    // 1000 - 300 = 700ms elapsed, cooldown is 600ms

    expect(result.hit).toBe(true);
  });

  it('handles edge case: zero HP attacker can still attempt attack', () => {
    const attacker = makeEntity(0, 50, 10, 600);
    const defender = makeEntity(80, 80, 5, 1500);
    const attackerPos: Position = { x: 100, y: 100 };
    const defenderPos: Position = { x: 130, y: 100 };

    const result = calculateAttack(attacker, defender, attackerPos, defenderPos, 70, 1000);

    expect(result.hit).toBe(true);
    expect(result.damage).toBe(10);
  });

  it('handles edge case: exact range boundary is a hit', () => {
    const attacker = makeEntity(50, 50, 10, 600);
    const defender = makeEntity(80, 80, 5, 1500);
    const attackerPos: Position = { x: 0, y: 0 };
    const defenderPos: Position = { x: 70, y: 0 }; // exactly 70px

    const result = calculateAttack(attacker, defender, attackerPos, defenderPos, 70, 1000);

    expect(result.hit).toBe(true);
  });
});

describe('applyDamage', () => {
  it('reduces HP by damage amount', () => {
    const entity = makeEntity(50, 50, 10, 600);
    const result = applyDamage(entity, 15);
    expect(result.hp).toBe(35);
  });

  it('HP cannot go below zero', () => {
    const entity = makeEntity(10, 50, 10, 600);
    const result = applyDamage(entity, 30);
    expect(result.hp).toBe(0);
  });

  it('preserves other entity properties', () => {
    const entity = makeEntity(50, 50, 10, 600);
    const result = applyDamage(entity, 15);
    expect(result.maxHp).toBe(50);
    expect(result.attackDamage).toBe(10);
    expect(result.attackCooldownMs).toBe(600);
  });
});

describe('checkPhaseTransition', () => {
  it('returns victory when boss HP is zero', () => {
    const state: FightState = {
      phase: 'fighting',
      playerEntity: makeEntity(30, 50, 10, 600),
      boss: {
        id: 'coyote',
        position: BOSS_SPAWN,
        spawnPosition: BOSS_SPAWN,
        facing: 'left',
        size: 64,
        entity: makeEntity(0, 80, 5, 1500),
        defeated: false,
        behavior: 'idle',
      },
    };

    const result = checkPhaseTransition(state);
    expect(result).toBe('victory');
  });

  it('returns defeated when player HP is zero', () => {
    const state: FightState = {
      phase: 'fighting',
      playerEntity: makeEntity(0, 50, 10, 600),
      boss: {
        id: 'coyote',
        position: BOSS_SPAWN,
        spawnPosition: BOSS_SPAWN,
        facing: 'left',
        size: 64,
        entity: makeEntity(30, 80, 5, 1500),
        defeated: false,
        behavior: 'attacking',
      },
    };

    const result = checkPhaseTransition(state);
    expect(result).toBe('defeated');
  });

  it('returns fighting when both are alive', () => {
    const state: FightState = {
      phase: 'fighting',
      playerEntity: makeEntity(30, 50, 10, 600),
      boss: {
        id: 'coyote',
        position: BOSS_SPAWN,
        spawnPosition: BOSS_SPAWN,
        facing: 'left',
        size: 64,
        entity: makeEntity(30, 80, 5, 1500),
        defeated: false,
        behavior: 'approaching',
      },
    };

    const result = checkPhaseTransition(state);
    expect(result).toBe('fighting');
  });

  it('returns exploring when not fighting', () => {
    const state: FightState = {
      phase: 'exploring',
      playerEntity: makeEntity(50, 50, 10, 600),
      boss: {
        id: 'coyote',
        position: BOSS_SPAWN,
        spawnPosition: BOSS_SPAWN,
        facing: 'left',
        size: 64,
        entity: makeEntity(80, 80, 5, 1500),
        defeated: false,
        behavior: 'idle',
      },
    };

    const result = checkPhaseTransition(state);
    expect(result).toBe('exploring');
  });
});

describe('checkFlee', () => {
  it('returns true when player is more than 200px from boss', () => {
    const playerPos: Position = { x: 0, y: 0 };
    const bossPos: Position = { x: 250, y: 0 };

    expect(checkFlee(playerPos, bossPos)).toBe(true);
  });

  it('returns false when player is within 200px of boss', () => {
    const playerPos: Position = { x: 100, y: 100 };
    const bossPos: Position = { x: 150, y: 100 };

    expect(checkFlee(playerPos, bossPos)).toBe(false);
  });

  it('returns false when exactly 200px away', () => {
    const playerPos: Position = { x: 0, y: 0 };
    const bossPos: Position = { x: 200, y: 0 };

    expect(checkFlee(playerPos, bossPos)).toBe(false);
  });
});

describe('createFightState', () => {
  it('creates correct initial fight state with exploring phase', () => {
    const state = createFightState(PLAYER_START, BOSS_SPAWN);

    expect(state.phase).toBe('exploring');
    expect(state.playerEntity.hp).toBe(50);
    expect(state.playerEntity.maxHp).toBe(50);
    expect(state.playerEntity.attackDamage).toBe(10);
    expect(state.playerEntity.attackCooldownMs).toBe(600);
    expect(state.boss.id).toBe('coyote');
    expect(state.boss.position).toEqual(BOSS_SPAWN);
    expect(state.boss.spawnPosition).toEqual(BOSS_SPAWN);
    expect(state.boss.entity.hp).toBe(80);
    expect(state.boss.entity.maxHp).toBe(80);
    expect(state.boss.defeated).toBe(false);
  });
});

describe('resetFightState', () => {
  it('fully heals player and resets boss after defeat', () => {
    const original = createFightState(PLAYER_START, BOSS_SPAWN);
    // Simulate damage
    const damaged: FightState = {
      ...original,
      phase: 'defeated',
      playerEntity: { ...original.playerEntity, hp: 0 },
      boss: {
        ...original.boss,
        entity: { ...original.boss.entity, hp: 20 },
      },
    };

    const reset = resetFightState(damaged, PLAYER_START, BOSS_SPAWN);

    expect(reset.phase).toBe('exploring');
    expect(reset.playerEntity.hp).toBe(50);
    expect(reset.boss.entity.hp).toBe(80);
    expect(reset.boss.defeated).toBe(false);
    expect(reset.boss.position).toEqual(BOSS_SPAWN);
  });
});

describe('HP preserved after flee', () => {
  it('player keeps current HP when fleeing; no auto-heal', () => {
    const original = createFightState(PLAYER_START, BOSS_SPAWN);
    const damaged: FightState = {
      ...original,
      phase: 'fighting',
      playerEntity: { ...original.playerEntity, hp: 25 },
    };

    // Simulate flee
    const afterFlee: FightState = {
      ...damaged,
      phase: 'exploring',
      boss: {
        ...damaged.boss,
        behavior: 'idle',
        position: damaged.boss.spawnPosition,
      },
    };

    expect(afterFlee.playerEntity.hp).toBe(25);
    expect(afterFlee.phase).toBe('exploring');
    expect(afterFlee.boss.entity.hp).toBe(80);
  });
});
