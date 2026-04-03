import type { ObjectType } from './objects.js';
import type { Position } from './state.js';

export type MessagePool = {
  firstDiscovery: string[];
  revisit: string[];
};

export type MessagePools = Record<ObjectType, MessagePool>;

export function getRandomMessage(pool: string[]): string {
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] ?? pool[0] ?? '';
}

export function showSpeechBubble(
  container: HTMLElement,
  position: Position,
  message: string,
  durationMs: number,
): void {
  const bubble = document.createElement('div');
  bubble.className = 'speech-bubble';
  bubble.textContent = message;
  bubble.style.position = 'absolute';
  bubble.style.left = `${position.x}px`;
  bubble.style.top = `${position.y - 40}px`;
  bubble.style.background = 'white';
  bubble.style.borderRadius = '12px';
  bubble.style.padding = '6px 12px';
  bubble.style.fontSize = '14px';
  bubble.style.fontFamily = "'Comic Sans MS', cursive, sans-serif";
  bubble.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  bubble.style.zIndex = '50';
  bubble.style.pointerEvents = 'none';
  bubble.style.whiteSpace = 'nowrap';
  bubble.style.transition = 'opacity 0.3s';
  container.appendChild(bubble);

  setTimeout(() => {
    bubble.style.opacity = '0';
    setTimeout(() => {
      bubble.remove();
    }, 300);
  }, durationMs);
}

export const MESSAGE_POOLS: MessagePools = {
  mushroom: {
    firstDiscovery: [
      'A tiny mushroom! So cute!',
      'Wow, a spotted mushroom!',
      'This mushroom smells like rain!',
    ],
    revisit: [
      'Hello again, little mushroom!',
      'Still here, little one!',
    ],
  },
  stone: {
    firstDiscovery: [
      'A shiny stone!',
      'This stone sparkles!',
      'What a smooth, pretty stone!',
    ],
    revisit: [
      'Still shiny as ever!',
      'My favorite stone!',
    ],
  },
  acorn: {
    firstDiscovery: [
      'An acorn! A squirrel must live nearby!',
      'This acorn is so round!',
      'A perfect little acorn!',
    ],
    revisit: [
      'Hello again, little acorn!',
      'Still waiting for a squirrel!',
    ],
  },
  feather: {
    firstDiscovery: [
      'A soft feather! So light!',
      'This feather tickles!',
      'A beautiful blue feather!',
    ],
    revisit: [
      'Still floating here!',
      'Soft as ever!',
    ],
  },
  flower: {
    firstDiscovery: [
      'A beautiful flower!',
      'This smells like adventure!',
      'What pretty petals!',
    ],
    revisit: [
      'Still blooming!',
      'Pretty as always!',
    ],
  },
  seashell: {
    firstDiscovery: [
      'A seashell! Far from the ocean!',
      'I can hear the sea!',
      'Such a pretty shell!',
    ],
    revisit: [
      'Still singing the ocean song!',
      'Hello again, shell friend!',
    ],
  },
  pinecone: {
    firstDiscovery: [
      'A pinecone! So spiky!',
      'This pinecone is huge!',
      'A perfect pinecone!',
    ],
    revisit: [
      'Still spiky!',
      'My favorite pinecone!',
    ],
  },
  berry: {
    firstDiscovery: [
      'A juicy berry!',
      'This berry is so red!',
      'Yum! A wild berry!',
    ],
    revisit: [
      'Still looks tasty!',
      'Berry nice to see you!',
    ],
  },
};
