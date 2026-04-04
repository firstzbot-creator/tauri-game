import './game.css';
import { updatePosition, type CatState, FIELD_WIDTH, FIELD_HEIGHT, STEP_SIZE, CAT_SIZE } from './state.js';
import { generateFlowers, renderWorld } from './world.js';
import { createCatElement, updateCatPosition, calculateMoveTarget } from './cat.js';
import { createAudioManager, loadMutePreference, MUSIC_VOLUME, SFX_VOLUME } from './audio.js';
import { createMuteButton } from './mute-button.js';
import { generateObjects, checkCollision, renderObjects } from './objects.js';
import { MESSAGE_POOLS, getRandomMessage, showSpeechBubble } from './messages.js';
import { createDiscoveryState, recordDiscovery, isDiscovered, renderDiscoveryCounter } from './discovery.js';
import { showSparkles } from './particles.js';
import { createWanderingAnimals, updateAnimalPositions, renderAnimals, updateAnimalElements } from './animals.js';
import { createFightState, calculateAttack, applyDamage, checkPhaseTransition, checkFlee, resetFightState } from './combat.js';
import type { FightState } from './fight-types.js';
import { updateBossAI, resetBossToSpawn } from './boss-ai.js';
import { markBossDefeated } from './boss.js';
import { renderFightHUD, updateHealthBars } from './fight-hud.js';
import { flashElement, shakeField, showVictoryParticles, showAttackLunge, showDefeatOverlay, removeDefeatOverlay } from './fight-effects.js';

const FLOWER_COUNT = 8;
const OBJECT_COUNT = 7;
const ANIMAL_COUNT = 3;
const OBJECT_SIZE = 32;
const SPEECH_DURATION_MS = 2500;
const INITIAL_X = (FIELD_WIDTH - CAT_SIZE) / 2;
const INITIAL_Y = (FIELD_HEIGHT - CAT_SIZE) / 2;
const BOSS_SPAWN = { x: 600, y: 420 };
const PLAYER_ATTACK_RANGE = 70;
const BOSS_ENGAGEMENT_RANGE = 120;
const BOSS_ATTACK_RANGE = 70;
const VICTORY_DELAY_MS = 3000;

function distanceBetween(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

function init(): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (app === null) {
    throw new Error('Could not find #app element');
  }

  app.innerHTML = '';
  app.className = 'game-container';

  const title = document.createElement('h1');
  title.className = 'game-title';
  title.textContent = 'Cat Adventure';
  app.appendChild(title);

  const field = document.createElement('div');
  field.id = 'game-field';
  app.appendChild(field);

  // World setup
  const flowers = generateFlowers(FLOWER_COUNT, FIELD_WIDTH, FIELD_HEIGHT);
  renderWorld(field, flowers);

  // Interactable objects
  const catStart = { x: INITIAL_X, y: INITIAL_Y };
  const objects = generateObjects(OBJECT_COUNT, FIELD_WIDTH, FIELD_HEIGHT, [catStart, BOSS_SPAWN]);
  renderObjects(field, objects);

  // Boss entity
  let fightState: FightState = createFightState(catStart, BOSS_SPAWN);

  const bossEl = document.createElement('img');
  bossEl.src = new URL('./assets/coyote.svg', import.meta.url).href;
  bossEl.alt = 'Coyote';
  bossEl.className = 'boss-entity';
  bossEl.style.position = 'absolute';
  bossEl.style.width = `${fightState.boss.size}px`;
  bossEl.style.height = `${fightState.boss.size}px`;
  bossEl.style.left = `${fightState.boss.position.x}px`;
  bossEl.style.top = `${fightState.boss.position.y}px`;
  bossEl.style.zIndex = '8';
  bossEl.style.pointerEvents = 'none';
  field.appendChild(bossEl);

  // Cat
  const catEl = createCatElement();
  field.appendChild(catEl);

  // Discovery state
  let discoveryState = createDiscoveryState();
  renderDiscoveryCounter(field, discoveryState.count);

  // Audio system
  const audioManager = createAudioManager({
    musicVolume: MUSIC_VOLUME,
    sfxVolume: SFX_VOLUME,
    muted: loadMutePreference(),
  });

  const muteBtn = createMuteButton(audioManager);
  field.appendChild(muteBtn);

  let musicStarted = false;
  function startMusicOnInteraction(): void {
    if (musicStarted) return;
    musicStarted = true;
    audioManager.startMusic();
  }

  // Wandering animals
  let animals = createWanderingAnimals(ANIMAL_COUNT, FIELD_WIDTH, FIELD_HEIGHT);
  renderAnimals(field, animals);

  let lastFrameTime = 0;

  function animateAnimals(now: number): void {
    lastFrameTime = now;
    animals = updateAnimalPositions(animals);
    updateAnimalElements(field, animals);

    // Boss AI update
    if (fightState.phase === 'fighting' && !fightState.boss.defeated) {
      const prevLastAttack = fightState.boss.entity.lastAttackTime;
      fightState = {
        ...fightState,
        boss: updateBossAI(fightState.boss, state.position, now),
      };

      // Boss attacked this frame if lastAttackTime changed to now
      if (fightState.boss.entity.lastAttackTime === now && prevLastAttack !== now) {
        fightState = {
          ...fightState,
          playerEntity: applyDamage(fightState.playerEntity, fightState.boss.entity.attackDamage),
        };
        flashElement(catEl, 200);
        shakeField(field, 300);
        audioManager.playSfx('player-hit');
        updateHealthBars(field, fightState);

        const newPhase = checkPhaseTransition(fightState);
        if (newPhase !== fightState.phase) {
          fightState = { ...fightState, phase: newPhase };
          handlePhaseChange(newPhase);
        }
      }

      // Check flee
      if (fightState.phase === 'fighting' && checkFlee(state.position, fightState.boss.position)) {
        fightState = {
          ...fightState,
          phase: 'exploring',
          boss: resetBossToSpawn(fightState.boss),
        };
        removeFightHUD();
      }

      // Update boss element position
      bossEl.style.left = `${fightState.boss.position.x}px`;
      bossEl.style.top = `${fightState.boss.position.y}px`;
      bossEl.style.transform = fightState.boss.facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
    }

    requestAnimationFrame(animateAnimals);
  }
  requestAnimationFrame(animateAnimals);

  // Game state
  let state: CatState = {
    position: { x: INITIAL_X, y: INITIAL_Y },
    facing: 'right',
    equippedHat: 'wizard',
  };

  function render(): void {
    updateCatPosition(catEl, state.position, state.facing);
  }

  function checkObjectCollisions(): void {
    for (const obj of objects) {
      if (!checkCollision(state.position, CAT_SIZE, obj, OBJECT_SIZE)) {
        continue;
      }

      const wasDiscovered = isDiscovered(discoveryState, obj.id);
      const pool = wasDiscovered
        ? MESSAGE_POOLS[obj.type].revisit
        : MESSAGE_POOLS[obj.type].firstDiscovery;
      const message = getRandomMessage(pool);
      showSpeechBubble(field, state.position, message, SPEECH_DURATION_MS);
      showSparkles(field, obj.position);
      audioManager.playSfx('discovery');

      if (!wasDiscovered) {
        discoveryState = recordDiscovery(discoveryState, obj.id);
        renderDiscoveryCounter(field, discoveryState.count);
        obj.discovered = true;
      }
    }
  }

  function removeFightHUD(): void {
    const hud = field.querySelector('.fight-hud');
    if (hud !== null) {
      hud.remove();
    }
  }

  function handlePhaseChange(newPhase: string): void {
    if (newPhase === 'victory') {
      fightState = {
        ...fightState,
        boss: markBossDefeated(fightState.boss),
      };
      audioManager.playSfx('victory-jingle');
      showVictoryParticles(field, fightState.boss.position);
      bossEl.classList.add('boss-defeat-anim');
      removeFightHUD();

      // Boss stays defeated for session
      setTimeout(() => {
        bossEl.style.display = 'none';
        fightState = { ...fightState, phase: 'exploring' };
      }, VICTORY_DELAY_MS);
    }

    if (newPhase === 'defeated') {
      audioManager.playSfx('defeat-sound');
      showDefeatOverlay(field);
      removeFightHUD();

      const retryBtn = field.querySelector<HTMLButtonElement>('.defeat-retry-button');
      if (retryBtn !== null) {
        retryBtn.addEventListener('click', () => {
          removeDefeatOverlay(field);
          fightState = resetFightState(fightState, catStart, BOSS_SPAWN);
          bossEl.style.display = '';
          bossEl.classList.remove('boss-defeat-anim');
          bossEl.style.left = `${BOSS_SPAWN.x}px`;
          bossEl.style.top = `${BOSS_SPAWN.y}px`;
        });
      }
    }
  }

  function checkBossProximity(): void {
    if (fightState.phase !== 'exploring' || fightState.boss.defeated) {
      return;
    }

    const dist = distanceBetween(
      state.position.x, state.position.y,
      fightState.boss.position.x, fightState.boss.position.y,
    );

    if (dist <= BOSS_ENGAGEMENT_RANGE) {
      fightState = { ...fightState, phase: 'fighting' };
      renderFightHUD(field, fightState);
    }
  }

  function handlePlayerAttack(now: number): void {
    if (fightState.phase !== 'fighting') {
      return;
    }

    const result = calculateAttack(
      fightState.playerEntity,
      fightState.boss.entity,
      state.position,
      fightState.boss.position,
      PLAYER_ATTACK_RANGE,
      now,
    );

    if (!result.hit) {
      return;
    }

    fightState = {
      ...fightState,
      playerEntity: {
        ...fightState.playerEntity,
        lastAttackTime: now,
      },
      boss: {
        ...fightState.boss,
        entity: applyDamage(fightState.boss.entity, result.damage),
      },
    };

    showAttackLunge(catEl, 150);
    flashElement(bossEl, 200);
    audioManager.playSfx('player-attack');
    audioManager.playSfx('boss-hit');
    updateHealthBars(field, fightState);

    const newPhase = checkPhaseTransition(fightState);
    if (newPhase !== fightState.phase) {
      fightState = { ...fightState, phase: newPhase };
      handlePhaseChange(newPhase);
    }
  }

  field.addEventListener('click', (e: MouseEvent) => {
    startMusicOnInteraction();
    const rect = field.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const target = calculateMoveTarget(state.position, { x: clickX, y: clickY }, STEP_SIZE);
    const dx = target.x - state.position.x;
    let facing = state.facing;
    if (dx > 0) facing = 'right';
    if (dx < 0) facing = 'left';
    state = { ...state, position: target, facing };
    render();
    checkObjectCollisions();
    checkBossProximity();
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const dirMap: Record<string, 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | undefined> = {
      ArrowUp: 'UP',
      ArrowDown: 'DOWN',
      ArrowLeft: 'LEFT',
      ArrowRight: 'RIGHT',
    };
    const dir = dirMap[e.key];

    if (dir !== undefined) {
      e.preventDefault();
      startMusicOnInteraction();
      state = updatePosition(state, dir);
      render();
      checkObjectCollisions();
      checkBossProximity();
      return;
    }

    if (e.key === ' ') {
      e.preventDefault();
      startMusicOnInteraction();
      handlePlayerAttack(performance.now());
    }
  });

  render();
}

init();
