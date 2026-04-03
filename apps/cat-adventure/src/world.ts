import type { Position } from './state.js';

export type FlowerPlacement = {
  position: Position;
  variant: number; // 0-3, selects which flower CSS class
};

export const FLOWER_PADDING = 20;

export function generateFlowers(
  count: number,
  fieldWidth: number,
  fieldHeight: number,
): FlowerPlacement[] {
  const flowers: FlowerPlacement[] = [];
  for (let i = 0; i < count; i++) {
    const x = FLOWER_PADDING + Math.random() * (fieldWidth - 2 * FLOWER_PADDING);
    const y = FLOWER_PADDING + Math.random() * (fieldHeight - 2 * FLOWER_PADDING);
    const variant = Math.floor(Math.random() * 4);
    flowers.push({ position: { x, y }, variant });
  }
  return flowers;
}

export function renderWorld(container: HTMLElement, flowers: FlowerPlacement[]): void {
  container.classList.add('game-field');

  for (const flower of flowers) {
    const el = document.createElement('div');
    el.className = `flower flower-${flower.variant}`;
    el.style.position = 'absolute';
    el.style.left = `${flower.position.x}px`;
    el.style.top = `${flower.position.y}px`;
    container.appendChild(el);
  }
}
