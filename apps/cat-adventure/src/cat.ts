import type { Position, Facing } from './state.js';
import { clampPosition, FIELD_WIDTH, FIELD_HEIGHT, CAT_SIZE } from './state.js';

export function createCatElement(): HTMLElement {
  const el = document.createElement('img');
  el.src = new URL('./assets/cat.svg', import.meta.url).href;
  el.alt = 'Cat';
  el.className = 'cat-sprite';
  el.style.position = 'absolute';
  el.style.width = `${CAT_SIZE}px`;
  el.style.height = `${CAT_SIZE}px`;
  el.style.transition = 'left 0.15s ease-out, top 0.15s ease-out';
  return el;
}

export function updateCatPosition(el: HTMLElement, position: Position, facing: Facing): void {
  el.style.left = `${position.x}px`;
  el.style.top = `${position.y}px`;
  el.style.transform = facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
}

export function calculateMoveTarget(
  current: Position,
  clickTarget: Position,
  stepSize: number,
): Position {
  const dx = clickTarget.x - current.x;
  const dy = clickTarget.y - current.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) {
    return current;
  }

  if (distance <= stepSize) {
    return clampPosition(
      { x: clickTarget.x, y: clickTarget.y },
      FIELD_WIDTH,
      FIELD_HEIGHT,
      CAT_SIZE,
    );
  }

  const ratio = stepSize / distance;
  const newPos: Position = {
    x: current.x + dx * ratio,
    y: current.y + dy * ratio,
  };

  return clampPosition(newPos, FIELD_WIDTH, FIELD_HEIGHT, CAT_SIZE);
}
