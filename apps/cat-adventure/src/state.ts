export type Position = { x: number; y: number };
export type Facing = 'left' | 'right';

export type CatState = {
  position: Position;
  facing: Facing;
  equippedHat: string;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const FIELD_WIDTH = 800;
export const FIELD_HEIGHT = 600;
export const CAT_SIZE = 64;
export const STEP_SIZE = 40;

export function clampPosition(
  position: Position,
  fieldWidth: number,
  fieldHeight: number,
  catSize: number,
): Position {
  return {
    x: Math.max(0, Math.min(fieldWidth - catSize, position.x)),
    y: Math.max(0, Math.min(fieldHeight - catSize, position.y)),
  };
}

export function updatePosition(state: CatState, dir: Direction): CatState {
  let { x, y } = state.position;
  let facing = state.facing;

  if (dir === 'UP') y -= STEP_SIZE;
  if (dir === 'DOWN') y += STEP_SIZE;
  if (dir === 'LEFT') { x -= STEP_SIZE; facing = 'left'; }
  if (dir === 'RIGHT') { x += STEP_SIZE; facing = 'right'; }

  const position = clampPosition({ x, y }, FIELD_WIDTH, FIELD_HEIGHT, CAT_SIZE);

  return { ...state, position, facing };
}

export function moveToward(state: CatState, target: Position, stepSize: number): CatState {
  const dx = target.x - state.position.x;
  const dy = target.y - state.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) {
    return state;
  }

  let newPosition: Position;
  let facing = state.facing;

  if (distance <= stepSize) {
    newPosition = { x: target.x, y: target.y };
  } else {
    const ratio = stepSize / distance;
    newPosition = {
      x: state.position.x + dx * ratio,
      y: state.position.y + dy * ratio,
    };
  }

  if (dx > 0) facing = 'right';
  if (dx < 0) facing = 'left';

  const clamped = clampPosition(newPosition, FIELD_WIDTH, FIELD_HEIGHT, CAT_SIZE);

  return { ...state, position: clamped, facing };
}
