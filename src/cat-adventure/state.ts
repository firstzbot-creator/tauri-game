export type CatState = {
  position: { x: number; y: number };
  equippedHat: string;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const MAX_X = 10;
const MAX_Y = 10;

export function updatePosition(state: CatState, dir: Direction): CatState {
  let { x, y } = state.position;
  
  if (dir === 'UP') y = Math.max(0, y - 1);
  if (dir === 'DOWN') y = Math.min(MAX_Y, y + 1);
  if (dir === 'LEFT') x = Math.max(0, x - 1);
  if (dir === 'RIGHT') x = Math.min(MAX_X, x + 1);

  return {
    ...state,
    position: { x, y }
  };
}
