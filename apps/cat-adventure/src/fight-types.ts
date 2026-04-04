import type { Position, Facing } from './state.js';

export type CombatPhase = 'exploring' | 'fighting' | 'victory' | 'defeated';

export type HealthPoints = number;

export type CombatEntity = {
  hp: HealthPoints;
  maxHp: HealthPoints;
  attackDamage: number;
  attackCooldownMs: number;
  lastAttackTime: number;
};

export type BossId = string;

export type BossBehavior = 'idle' | 'approaching' | 'attacking';

export type BossState = {
  id: BossId;
  position: Position;
  spawnPosition: Position;
  facing: Facing;
  size: number;
  entity: CombatEntity;
  defeated: boolean;
  behavior: BossBehavior;
};

export type FightState = {
  phase: CombatPhase;
  playerEntity: CombatEntity;
  boss: BossState;
};

export type AttackResult = {
  hit: boolean;
  damage: number;
  attackerPosition: Position;
  defenderPosition: Position;
  timestamp: number;
};
