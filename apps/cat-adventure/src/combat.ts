import type { CombatEntity, CombatPhase, FightState, AttackResult } from './fight-types.js';
import type { Position } from './state.js';

const PLAYER_HP = 50;
const PLAYER_ATTACK_DAMAGE = 10;
const PLAYER_ATTACK_COOLDOWN_MS = 600;

const BOSS_HP = 80;
const BOSS_ATTACK_DAMAGE = 5;
const BOSS_ATTACK_COOLDOWN_MS = 1500;
const BOSS_SIZE = 64;

const FLEE_DISTANCE = 200;

export function createCombatEntity(
  hp: number,
  attackDamage: number,
  attackCooldownMs: number,
): CombatEntity {
  return {
    hp,
    maxHp: hp,
    attackDamage,
    attackCooldownMs,
    lastAttackTime: 0,
  };
}

function distanceBetween(a: Position, b: Position): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function calculateAttack(
  attacker: CombatEntity,
  defender: CombatEntity,
  attackerPosition: Position,
  defenderPosition: Position,
  attackRange: number,
  now: number,
): AttackResult {
  const dist = distanceBetween(attackerPosition, defenderPosition);
  const cooldownElapsed = now - attacker.lastAttackTime;

  const result: AttackResult = {
    hit: false,
    damage: 0,
    attackerPosition,
    defenderPosition,
    timestamp: now,
  };

  if (dist > attackRange) {
    return result;
  }

  if (cooldownElapsed < attacker.attackCooldownMs) {
    return result;
  }

  return {
    hit: true,
    damage: attacker.attackDamage,
    attackerPosition,
    defenderPosition,
    timestamp: now,
  };
}

export function applyDamage(entity: CombatEntity, damage: number): CombatEntity {
  return {
    ...entity,
    hp: Math.max(0, entity.hp - damage),
  };
}

export function checkPhaseTransition(state: FightState): CombatPhase {
  if (state.phase !== 'fighting') {
    return state.phase;
  }

  if (state.boss.entity.hp <= 0) {
    return 'victory';
  }

  if (state.playerEntity.hp <= 0) {
    return 'defeated';
  }

  return 'fighting';
}

export function checkFlee(playerPosition: Position, bossPosition: Position): boolean {
  return distanceBetween(playerPosition, bossPosition) > FLEE_DISTANCE;
}

export function createFightState(playerStart: Position, bossSpawn: Position): FightState {
  return {
    phase: 'exploring',
    playerEntity: createCombatEntity(PLAYER_HP, PLAYER_ATTACK_DAMAGE, PLAYER_ATTACK_COOLDOWN_MS),
    boss: {
      id: 'coyote',
      position: { ...bossSpawn },
      spawnPosition: { ...bossSpawn },
      facing: 'left',
      size: BOSS_SIZE,
      entity: createCombatEntity(BOSS_HP, BOSS_ATTACK_DAMAGE, BOSS_ATTACK_COOLDOWN_MS),
      defeated: false,
      behavior: 'idle',
    },
  };
}

export function resetFightState(
  _state: FightState,
  playerStart: Position,
  bossSpawn: Position,
): FightState {
  return {
    phase: 'exploring',
    playerEntity: createCombatEntity(PLAYER_HP, PLAYER_ATTACK_DAMAGE, PLAYER_ATTACK_COOLDOWN_MS),
    boss: {
      id: 'coyote',
      position: { ...bossSpawn },
      spawnPosition: { ...bossSpawn },
      facing: 'left',
      size: BOSS_SIZE,
      entity: createCombatEntity(BOSS_HP, BOSS_ATTACK_DAMAGE, BOSS_ATTACK_COOLDOWN_MS),
      defeated: false,
      behavior: 'idle',
    },
  };
}
