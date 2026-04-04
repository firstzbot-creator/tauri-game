import type { BossState, BossBehavior } from './fight-types.js';
import type { Position, Facing } from './state.js';

const ENGAGEMENT_RANGE = 120;
const ATTACK_RANGE = 70;
const BOSS_SPEED = 1;

function distanceBetween(a: Position, b: Position): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function moveToward(from: Position, target: Position, speed: number): Position {
  const dx = target.x - from.x;
  const dy = target.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist <= speed || dist === 0) {
    return { x: target.x, y: target.y };
  }

  const ratio = speed / dist;
  return {
    x: from.x + dx * ratio,
    y: from.y + dy * ratio,
  };
}

function faceToward(from: Position, target: Position): Facing {
  const dx = target.x - from.x;
  return dx >= 0 ? 'right' : 'left';
}

export function updateBossAI(
  boss: BossState,
  playerPosition: Position,
  now: number,
): BossState {
  if (boss.defeated) {
    return boss;
  }

  const dist = distanceBetween(boss.position, playerPosition);
  const cooldownElapsed = now - boss.entity.lastAttackTime;
  const canAttack = cooldownElapsed >= boss.entity.attackCooldownMs;

  // Determine behavior
  let newBehavior: BossBehavior;
  let newPosition = boss.position;
  let newFacing = boss.facing;
  let newLastAttackTime = boss.entity.lastAttackTime;

  if (dist > ENGAGEMENT_RANGE && boss.behavior === 'idle') {
    newBehavior = 'idle';
  } else if (dist <= ATTACK_RANGE) {
    newBehavior = 'attacking';
    newFacing = faceToward(boss.position, playerPosition);

    if (canAttack) {
      newLastAttackTime = now;
    }
  } else if (dist <= ENGAGEMENT_RANGE || boss.behavior === 'approaching' || boss.behavior === 'attacking') {
    newBehavior = 'approaching';
    newPosition = moveToward(boss.position, playerPosition, BOSS_SPEED);
    newFacing = faceToward(boss.position, playerPosition);
  } else {
    newBehavior = boss.behavior;
  }

  return {
    ...boss,
    position: newPosition,
    facing: newFacing,
    behavior: newBehavior,
    entity: {
      ...boss.entity,
      lastAttackTime: newLastAttackTime,
    },
  };
}

export function resetBossToSpawn(boss: BossState): BossState {
  return {
    ...boss,
    position: { ...boss.spawnPosition },
    behavior: 'idle',
  };
}
