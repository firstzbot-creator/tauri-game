// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { generateObjects, checkCollision, renderObjects } from './objects.js';
import { MESSAGE_POOLS, getRandomMessage, showSpeechBubble } from './messages.js';
import { createDiscoveryState, recordDiscovery, isDiscovered, renderDiscoveryCounter } from './discovery.js';
import { showSparkles } from './particles.js';
import { FIELD_WIDTH, FIELD_HEIGHT, CAT_SIZE } from './state.js';
import type { FieldObject } from './objects.js';

const OBJECT_SIZE = 32;

describe('discovery flow (integration)', () => {
  let container: HTMLElement;
  let objects: FieldObject[];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    objects = generateObjects(6, FIELD_WIDTH, FIELD_HEIGHT, []);
    renderObjects(container, objects);
    return () => {
      document.body.removeChild(container);
    };
  });

  it('renders correct number of object elements', () => {
    const els = container.querySelectorAll('.field-object');
    expect(els.length).toBe(6);
  });

  it('collision with object triggers speech bubble DOM creation', () => {
    const obj = objects[0];
    if (obj === undefined) throw new Error('No object');
    // Place cat exactly on top of the object
    const catPos = { x: obj.position.x, y: obj.position.y };
    const collision = checkCollision(catPos, CAT_SIZE, obj, OBJECT_SIZE);
    expect(collision).toBe(true);

    // Show speech bubble
    const message = getRandomMessage(MESSAGE_POOLS[obj.type].firstDiscovery);
    showSpeechBubble(container, catPos, message, 2500);
    const bubble = container.querySelector('.speech-bubble');
    expect(bubble).not.toBeNull();
    expect(bubble?.textContent).toBe(message);
  });

  it('speech bubble contains text from the correct message pool', () => {
    const obj = objects[0];
    if (obj === undefined) throw new Error('No object');
    const pool = MESSAGE_POOLS[obj.type].firstDiscovery;
    const message = getRandomMessage(pool);
    expect(pool).toContain(message);
  });

  it('discovery counter updates from 0 to 1 after first discovery', () => {
    renderDiscoveryCounter(container, 0);
    let counter = container.querySelector('.discovery-counter');
    expect(counter?.textContent).toContain('0');

    let state = createDiscoveryState();
    state = recordDiscovery(state, 'obj-0');
    renderDiscoveryCounter(container, state.count);
    counter = container.querySelector('.discovery-counter');
    expect(counter?.textContent).toContain('1');
  });

  it('second touch of same object does not increment counter', () => {
    let state = createDiscoveryState();
    state = recordDiscovery(state, 'obj-0');
    expect(state.count).toBe(1);
    state = recordDiscovery(state, 'obj-0');
    expect(state.count).toBe(1);
  });

  it('sparkle elements are created on discovery', () => {
    const obj = objects[0];
    if (obj === undefined) throw new Error('No object');
    showSparkles(container, obj.position);
    const sparkles = container.querySelectorAll('.sparkle');
    expect(sparkles.length).toBeGreaterThanOrEqual(5);
  });
});
