import type { Position } from './state.js';

export type ObjectType = 'mushroom' | 'stone' | 'acorn' | 'feather' | 'flower' | 'seashell' | 'pinecone' | 'berry';

export type FieldObject = {
  id: string;
  type: ObjectType;
  position: Position;
  discovered: boolean;
};

const OBJECT_TYPES: readonly ObjectType[] = ['mushroom', 'stone', 'acorn', 'feather', 'flower', 'seashell', 'pinecone', 'berry'];
const MIN_SPACING = 40;
const EXCLUDE_RADIUS = 80;
const EDGE_PADDING = 40;

export function generateObjects(
  count: number,
  fieldWidth: number,
  fieldHeight: number,
  excludeZones: Position[],
): FieldObject[] {
  const objects: FieldObject[] = [];
  const maxAttempts = 200;

  for (let i = 0; i < count; i++) {
    let placed = false;
    for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
      const x = EDGE_PADDING + Math.random() * (fieldWidth - 2 * EDGE_PADDING);
      const y = EDGE_PADDING + Math.random() * (fieldHeight - 2 * EDGE_PADDING);
      const pos: Position = { x, y };

      const tooCloseToExclude = excludeZones.some(zone => {
        const dx = pos.x - zone.x;
        const dy = pos.y - zone.y;
        return Math.sqrt(dx * dx + dy * dy) < EXCLUDE_RADIUS;
      });

      const tooCloseToOther = objects.some(other => {
        const dx = pos.x - other.position.x;
        const dy = pos.y - other.position.y;
        return Math.sqrt(dx * dx + dy * dy) < MIN_SPACING;
      });

      if (!tooCloseToExclude && !tooCloseToOther) {
        const typeIndex = (i + Math.floor(Math.random() * OBJECT_TYPES.length)) % OBJECT_TYPES.length;
        objects.push({
          id: `obj-${i}`,
          type: OBJECT_TYPES[typeIndex] ?? 'mushroom',
          position: pos,
          discovered: false,
        });
        placed = true;
      }
    }

    if (!placed) {
      // Fallback: place at a random position ignoring spacing
      const x = EDGE_PADDING + Math.random() * (fieldWidth - 2 * EDGE_PADDING);
      const y = EDGE_PADDING + Math.random() * (fieldHeight - 2 * EDGE_PADDING);
      objects.push({
        id: `obj-${i}`,
        type: OBJECT_TYPES[i % OBJECT_TYPES.length] ?? 'mushroom',
        position: { x, y },
        discovered: false,
      });
    }
  }

  return objects;
}

export function checkCollision(
  catPosition: Position,
  catSize: number,
  object: FieldObject,
  objectSize: number,
): boolean {
  const catRight = catPosition.x + catSize;
  const catBottom = catPosition.y + catSize;
  const objRight = object.position.x + objectSize;
  const objBottom = object.position.y + objectSize;

  return (
    catPosition.x <= objRight &&
    catRight >= object.position.x &&
    catPosition.y <= objBottom &&
    catBottom >= object.position.y
  );
}

export function renderObjects(container: HTMLElement, objects: FieldObject[]): void {
  for (const obj of objects) {
    const el = document.createElement('div');
    el.className = `field-object field-object-${obj.type}`;
    el.dataset['objectId'] = obj.id;
    el.style.position = 'absolute';
    el.style.left = `${obj.position.x}px`;
    el.style.top = `${obj.position.y}px`;
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.fontSize = '24px';
    el.style.textAlign = 'center';
    el.style.lineHeight = '32px';
    el.style.pointerEvents = 'none';
    el.textContent = getObjectEmoji(obj.type);
    container.appendChild(el);
  }
}

function getObjectEmoji(type: ObjectType): string {
  const emojiMap: Record<ObjectType, string> = {
    mushroom: '\u{1F344}',
    stone: '\u{1FAA8}',
    acorn: '\u{1F330}',
    feather: '\u{1FAB6}',
    flower: '\u{1F33C}',
    seashell: '\u{1F41A}',
    pinecone: '\u{1F332}',
    berry: '\u{1FAD0}',
  };
  return emojiMap[type];
}
