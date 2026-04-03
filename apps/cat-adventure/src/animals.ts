import type { Position } from './state.js';

export type AnimalType = 'butterfly' | 'ladybug' | 'bunny';

export type WanderingAnimal = {
  type: AnimalType;
  position: Position;
  path: Position[];
  currentWaypoint: number;
  speed: number;
};

const ANIMAL_TYPES: readonly AnimalType[] = ['butterfly', 'ladybug', 'bunny'];
const WAYPOINT_COUNT = 4;

export function createWanderingAnimals(
  count: number,
  fieldWidth: number,
  fieldHeight: number,
): WanderingAnimal[] {
  const animals: WanderingAnimal[] = [];
  const padding = 50;

  for (let i = 0; i < count; i++) {
    const path: Position[] = [];
    for (let w = 0; w < WAYPOINT_COUNT; w++) {
      path.push({
        x: padding + Math.random() * (fieldWidth - 2 * padding),
        y: padding + Math.random() * (fieldHeight - 2 * padding),
      });
    }

    const start = path[0];
    animals.push({
      type: ANIMAL_TYPES[i % ANIMAL_TYPES.length] ?? 'butterfly',
      position: start !== undefined ? { x: start.x, y: start.y } : { x: 100, y: 100 },
      path,
      currentWaypoint: 0,
      speed: 0.5 + Math.random() * 0.5,
    });
  }

  return animals;
}

export function updateAnimalPositions(animals: WanderingAnimal[]): WanderingAnimal[] {
  return animals.map(animal => {
    const target = animal.path[animal.currentWaypoint];
    if (target === undefined) {
      return { ...animal, currentWaypoint: 0 };
    }

    const dx = target.x - animal.position.x;
    const dy = target.y - animal.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= animal.speed) {
      const nextWaypoint = (animal.currentWaypoint + 1) % animal.path.length;
      return {
        ...animal,
        position: { x: target.x, y: target.y },
        currentWaypoint: nextWaypoint,
      };
    }

    const ratio = animal.speed / dist;
    return {
      ...animal,
      position: {
        x: animal.position.x + dx * ratio,
        y: animal.position.y + dy * ratio,
      },
    };
  });
}

export function renderAnimals(container: HTMLElement, animals: WanderingAnimal[]): void {
  for (const animal of animals) {
    const el = document.createElement('div');
    el.className = `wandering-animal wandering-animal-${animal.type}`;
    el.style.position = 'absolute';
    el.style.left = `${animal.position.x}px`;
    el.style.top = `${animal.position.y}px`;
    el.style.fontSize = '24px';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '5';
    el.style.transition = 'left 0.1s linear, top 0.1s linear';
    el.textContent = getAnimalEmoji(animal.type);
    container.appendChild(el);
  }
}

export function updateAnimalElements(container: HTMLElement, animals: WanderingAnimal[]): void {
  const elements = container.querySelectorAll('.wandering-animal');
  animals.forEach((animal, i) => {
    const el = elements[i] as HTMLElement | undefined;
    if (el !== undefined) {
      el.style.left = `${animal.position.x}px`;
      el.style.top = `${animal.position.y}px`;
    }
  });
}

function getAnimalEmoji(type: AnimalType): string {
  const map: Record<AnimalType, string> = {
    butterfly: '\u{1F98B}',
    ladybug: '\u{1F41E}',
    bunny: '\u{1F430}',
  };
  return map[type];
}
