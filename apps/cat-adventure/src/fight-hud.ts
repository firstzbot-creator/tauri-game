import type { FightState } from './fight-types.js';

export function renderFightHUD(container: HTMLElement, state: FightState): void {
  // Remove existing HUD if any
  const existing = container.querySelector('.fight-hud');
  if (existing !== null) {
    existing.remove();
  }

  const hud = document.createElement('div');
  hud.className = 'fight-hud';

  // Player health bar
  const playerBar = document.createElement('div');
  playerBar.className = 'health-bar player-hp-bar';
  const playerFill = document.createElement('div');
  playerFill.className = 'health-bar-fill player-hp-fill';
  playerFill.style.width = `${(state.playerEntity.hp / state.playerEntity.maxHp) * 100}%`;
  playerBar.appendChild(playerFill);

  const playerLabel = document.createElement('span');
  playerLabel.className = 'health-bar-label';
  playerLabel.textContent = '\u{1F431}';
  playerBar.appendChild(playerLabel);

  hud.appendChild(playerBar);

  // Boss health bar
  const bossBar = document.createElement('div');
  bossBar.className = 'health-bar boss-hp-bar';
  const bossFill = document.createElement('div');
  bossFill.className = 'health-bar-fill boss-hp-fill';
  bossFill.style.width = `${(state.boss.entity.hp / state.boss.entity.maxHp) * 100}%`;
  bossBar.appendChild(bossFill);

  const bossLabel = document.createElement('span');
  bossLabel.className = 'health-bar-label boss-name';
  bossLabel.textContent = 'Coyote';
  bossBar.appendChild(bossLabel);

  hud.appendChild(bossBar);

  // Fight status text
  if (state.phase === 'fighting') {
    const statusText = document.createElement('div');
    statusText.className = 'fight-status-text';
    statusText.textContent = 'FIGHT!';
    hud.appendChild(statusText);
  }

  container.appendChild(hud);
}

export function updateHealthBars(container: HTMLElement, state: FightState): void {
  const playerFill = container.querySelector('.player-hp-fill') as HTMLElement | null;
  const bossFill = container.querySelector('.boss-hp-fill') as HTMLElement | null;

  if (playerFill !== null) {
    playerFill.style.width = `${(state.playerEntity.hp / state.playerEntity.maxHp) * 100}%`;
  }

  if (bossFill !== null) {
    bossFill.style.width = `${(state.boss.entity.hp / state.boss.entity.maxHp) * 100}%`;
  }
}
