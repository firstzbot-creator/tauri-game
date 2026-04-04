import type { Position } from './state.js';

const VICTORY_SPARKLE_COUNT = 10;

export function flashElement(el: HTMLElement, durationMs: number): void {
  el.classList.add('hit-flash');
  setTimeout(() => {
    el.classList.remove('hit-flash');
  }, durationMs);
}

export function shakeField(field: HTMLElement, durationMs: number): void {
  field.classList.add('screen-shake');
  setTimeout(() => {
    field.classList.remove('screen-shake');
  }, durationMs);
}

export function showAttackLunge(el: HTMLElement, durationMs: number): void {
  el.classList.add('cat-lunge');
  setTimeout(() => {
    el.classList.remove('cat-lunge');
  }, durationMs);
}

export function showVictoryParticles(container: HTMLElement, position: Position): void {
  for (let i = 0; i < VICTORY_SPARKLE_COUNT; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'victory-sparkle';
    sparkle.style.position = 'absolute';
    sparkle.style.left = `${position.x + (Math.random() - 0.5) * 80}px`;
    sparkle.style.top = `${position.y + (Math.random() - 0.5) * 80}px`;
    sparkle.style.width = '10px';
    sparkle.style.height = '10px';
    sparkle.style.borderRadius = '50%';
    sparkle.style.background = `hsl(${Math.random() * 40 + 40}, 100%, 65%)`;
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '70';
    sparkle.style.animation = 'victory-sparkle-anim 1.5s ease-out forwards';
    container.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 1500);
  }
}

export function showDefeatOverlay(container: HTMLElement): void {
  const overlay = document.createElement('div');
  overlay.className = 'defeat-overlay';

  const message = document.createElement('div');
  message.className = 'defeat-message';
  message.textContent = 'So Close! Try again!';
  overlay.appendChild(message);

  const button = document.createElement('button');
  button.className = 'defeat-retry-button';
  button.textContent = 'Try Again';
  overlay.appendChild(button);

  container.appendChild(overlay);
}

export function removeDefeatOverlay(container: HTMLElement): void {
  const overlay = container.querySelector('.defeat-overlay');
  if (overlay !== null) {
    overlay.remove();
  }
}
