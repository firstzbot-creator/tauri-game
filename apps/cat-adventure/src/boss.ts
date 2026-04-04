import type { BossState } from './fight-types.js';
import type { Position, Facing } from './state.js';

const BOSS_HP = 80;
const BOSS_ATTACK_DAMAGE = 5;
const BOSS_ATTACK_COOLDOWN_MS = 1500;
const BOSS_SIZE = 64;

export function createBoss(id: string, spawnPosition: Position): BossState {
  return {
    id,
    position: { ...spawnPosition },
    spawnPosition: { ...spawnPosition },
    facing: 'left',
    size: BOSS_SIZE,
    entity: {
      hp: BOSS_HP,
      maxHp: BOSS_HP,
      attackDamage: BOSS_ATTACK_DAMAGE,
      attackCooldownMs: BOSS_ATTACK_COOLDOWN_MS,
      lastAttackTime: 0,
    },
    defeated: false,
    behavior: 'idle',
  };
}

export function markBossDefeated(boss: BossState): BossState {
  return {
    ...boss,
    defeated: true,
    entity: { ...boss.entity, hp: 0 },
  };
}
