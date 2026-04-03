import type { AudioManager } from './audio.js';

export function createMuteButton(audioManager: AudioManager): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'mute-button';
  btn.style.position = 'absolute';
  btn.style.top = '8px';
  btn.style.right = '8px';
  btn.style.zIndex = '100';
  btn.style.background = 'rgba(0, 0, 0, 0.3)';
  btn.style.border = 'none';
  btn.style.borderRadius = '50%';
  btn.style.width = '36px';
  btn.style.height = '36px';
  btn.style.fontSize = '18px';
  btn.style.cursor = 'pointer';

  function updateIcon(): void {
    btn.textContent = audioManager.isMuted() ? '🔇' : '🔊';
  }

  btn.addEventListener('click', (e: MouseEvent) => {
    e.stopPropagation();
    audioManager.toggleMute();
    updateIcon();
  });

  updateIcon();
  return btn;
}
