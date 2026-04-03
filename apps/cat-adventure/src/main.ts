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

const FLOWER_COUNT = 8;
const OBJECT_COUNT = 7;
const ANIMAL_COUNT = 3;
const OBJECT_SIZE = 32;
const SPEECH_DURATION_MS = 2500;
const INITIAL_X = (FIELD_WIDTH - CAT_SIZE) / 2;
const INITIAL_Y = (FIELD_HEIGHT - CAT_SIZE) / 2;

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
  const objects = generateObjects(OBJECT_COUNT, FIELD_WIDTH, FIELD_HEIGHT, [catStart]);
  renderObjects(field, objects);

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

  function animateAnimals(): void {
    animals = updateAnimalPositions(animals);
    updateAnimalElements(field, animals);
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
    }
  });

  render();
}

init();
