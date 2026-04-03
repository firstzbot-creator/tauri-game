import type { Position } from './state.js';

const SPARKLE_COUNT = 6;

export function showSparkles(container: HTMLElement, position: Position): void {
  for (let i = 0; i < SPARKLE_COUNT; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.position = 'absolute';
    sparkle.style.left = `${position.x + (Math.random() - 0.5) * 40}px`;
    sparkle.style.top = `${position.y + (Math.random() - 0.5) * 40}px`;
    sparkle.style.width = '8px';
    sparkle.style.height = '8px';
    sparkle.style.borderRadius = '50%';
    sparkle.style.background = `hsl(${Math.random() * 60 + 40}, 100%, 70%)`;
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '60';
    sparkle.style.animation = 'sparkle-fade 1s ease-out forwards';
    container.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 1000);
  }
}
