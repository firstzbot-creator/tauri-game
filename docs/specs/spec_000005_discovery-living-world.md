---
id: spec_000005
title: Discovery & Living World
status: completed
created: 2026-04-02
author: Claude (spec-build)
game: cat-adventure
depends_on: [spec_000003, spec_000004]
---

# Problem Statement

A beautiful field with a walking cat is nice to look at, but without things to *do*, a child loses interest in under a minute. The field needs interactive objects to discover and ambient life that makes the world feel real. The interaction model should be wordless and intuitive — the cat touches something, something delightful happens.

# Scope

**IN SCOPE:**
- 5-8 interactable objects randomly placed on the field each session (mushroom, shiny stone, acorn, feather, flower, seashell, pinecone, berry)
- Collision detection: when cat sprite overlaps an object, trigger a discovery event
- Speech bubble near the cat showing a randomized message (e.g., "Wow, a shiny stone!", "This smells like adventure!")
- Each object type has 3-5 message variants — selected randomly on each touch
- CSS sparkle/star particle effect on discovery (pure CSS animation, no library)
- Sound effect on discovery (calls `playSfx('discovery')` from audio module)
- Discovery counter: paw-print icon + number in top-left corner, increments on first unique discovery
- Re-touching a discovered object shows a different "revisit" message (e.g., "Hello again, little acorn!")
- 2-3 wandering ambient animals (butterfly, ladybug, bunny) that move along simple paths on the field
- Ambient animals are decorative only — not interactable in this spec

**OUT OF SCOPE:**
- Inventory or item collection (objects stay on field, not "picked up")
- Interacting with ambient animals (future spec)
- Object persistence across sessions (re-randomized each time)
- Complex AI or pathfinding for ambient animals
- Achievement system or rewards beyond the counter
- Animated object sprites (static images for v1)

# Acceptance Criteria

1. At least 5 interactable objects are placed at random positions on the field at game start, with no overlap with each other or the cat's starting position
2. When the cat sprite overlaps an object (bounding box collision), a discovery event fires
3. A speech bubble appears near the cat showing a randomized message, visible for ~2.5 seconds, then fades out
4. Each object type has at least 3 unique first-discovery messages and 2 revisit messages
5. CSS sparkle particles appear at the collision point on discovery, lasting ~1 second
6. The `playSfx('discovery')` sound plays on each discovery event (if audio module available)
7. A paw-print icon with discovery count is visible in the top-left corner
8. Counter increments only on first touch of each unique object; re-touching does not increment
9. At least 2 ambient animals are visible, moving along paths on the field independently
10. Ambient animals do not block the cat's movement or trigger discovery events
11. **Performance**: Collision detection check completes in ≤2ms per frame (called on each position update)

# Architecture & Design

## Module Design

### `objects.ts` — Interactable objects

```typescript
type ObjectType = 'mushroom' | 'stone' | 'acorn' | 'feather' | 'flower' | 'seashell' | 'pinecone' | 'berry';

type FieldObject = {
  id: string;           // unique per instance, e.g., 'obj-0', 'obj-1'
  type: ObjectType;
  position: Position;
  discovered: boolean;
};

function generateObjects(count: number, fieldWidth: number, fieldHeight: number, excludeZones: Position[]): FieldObject[];
function checkCollision(catPosition: Position, catSize: number, object: FieldObject, objectSize: number): boolean;
function renderObjects(container: HTMLElement, objects: FieldObject[]): void;
```

- `generateObjects` places objects randomly, with minimum spacing between them and away from exclude zones (cat start position)
- `checkCollision` uses axis-aligned bounding box (AABB) overlap test
- Objects are rendered as absolutely-positioned `<img>` or `<div>` elements

### `messages.ts` — Message pools and speech bubbles

```typescript
type MessagePool = {
  firstDiscovery: string[];  // 3-5 messages per object type
  revisit: string[];          // 2-3 messages per object type
};

type MessagePools = Record<ObjectType, MessagePool>;

function getRandomMessage(pool: string[]): string;
function showSpeechBubble(container: HTMLElement, position: Position, message: string, durationMs: number): void;

const MESSAGE_POOLS: MessagePools;  // exported constant with all messages
```

- `showSpeechBubble` creates a div with bubble styling, positions it near the cat, fades it out after `durationMs`
- Messages are playful, short, and use simple words a young child can understand (or be read to)

### `particles.ts` — Sparkle effect

```typescript
function showSparkles(container: HTMLElement, position: Position): void;
```

- Creates 5-8 small star/circle divs at the position with CSS `@keyframes` for scale + opacity + drift
- Elements self-remove after animation completes (~1 second)

### `discovery.ts` — Discovery state and counter

```typescript
type DiscoveryState = {
  discoveredIds: Set<string>;
  count: number;
};

function createDiscoveryState(): DiscoveryState;
function recordDiscovery(state: DiscoveryState, objectId: string): DiscoveryState;
function isDiscovered(state: DiscoveryState, objectId: string): boolean;
function renderDiscoveryCounter(container: HTMLElement, count: number): void;
```

### `animals.ts` — Ambient wandering animals

```typescript
type AnimalType = 'butterfly' | 'ladybug' | 'bunny';

type WanderingAnimal = {
  type: AnimalType;
  position: Position;
  path: Position[];     // waypoints to follow
  currentWaypoint: number;
  speed: number;        // pixels per animation frame
};

function createWanderingAnimals(count: number, fieldWidth: number, fieldHeight: number): WanderingAnimal[];
function updateAnimalPositions(animals: WanderingAnimal[]): WanderingAnimal[];
function renderAnimals(container: HTMLElement, animals: WanderingAnimal[]): void;
```

- Animals follow a looping path of 3-5 waypoints
- `updateAnimalPositions` moves each animal one step toward its next waypoint; wraps to first waypoint at end
- Called from a `requestAnimationFrame` loop in `main.ts`

### Integration with `main.ts`

- On each cat position update (arrow key or click-to-move): run collision check against all objects
- On collision: determine first-discovery vs revisit → get random message → show speech bubble → show sparkles → play SFX → update discovery state
- Start animal animation loop on init
- Render discovery counter on init, update on each new discovery

## Asset Strategy

- Object sprites: small PNGs (~32×32) at `apps/cat-adventure/src/assets/objects/` — mushroom.png, stone.png, etc.
- Animal sprites: small PNGs (~32-48px) at `apps/cat-adventure/src/assets/animals/` — butterfly.png, ladybug.png, bunny.png
- Alternatively: CSS-only objects using emoji or styled divs (fallback if art isn't ready)
- Sparkle particles: pure CSS, no image assets needed

## Performance Design

1. **Latency-sensitive operations?** Yes — collision detection runs on every position update
2. **Performance envelope?** ≤2ms for collision check against all objects (5-8 AABB checks is trivial, but must not block frame)
3. **Throughput concerns?** Animal animation loop runs at 60fps — must be lightweight (just position updates + CSS transform)
4. **Regression signals?** Measure `checkCollision` batch time in unit tests; flag if >2ms for 10 objects

# Verification

## Unit Tests (`src/**/*.test.ts`)

- `objects.test.ts`:
  - `generateObjects` returns requested count with positions within field bounds
  - `generateObjects` maintains minimum spacing between objects
  - `generateObjects` avoids exclude zones
  - `checkCollision` returns `true` when bounding boxes overlap
  - `checkCollision` returns `false` when bounding boxes don't overlap
  - `checkCollision` handles edge case: exact boundary touch
- `messages.test.ts`:
  - `getRandomMessage` returns a string from the provided pool
  - `getRandomMessage` does not return undefined for non-empty pool
  - `MESSAGE_POOLS` has entries for all `ObjectType` values
  - Each pool has at least 3 `firstDiscovery` and 2 `revisit` messages
- `discovery.test.ts`:
  - `createDiscoveryState` returns state with count 0 and empty set
  - `recordDiscovery` increments count and adds ID to set
  - `recordDiscovery` with already-discovered ID does not increment count
  - `isDiscovered` returns correct boolean for known/unknown IDs
- `animals.test.ts`:
  - `createWanderingAnimals` returns requested count with valid positions
  - `updateAnimalPositions` moves animals toward their next waypoint
  - `updateAnimalPositions` wraps to first waypoint when reaching the last
- `particles.test.ts`:
  - `showSparkles` creates child elements at the specified position (JSDOM)

## Integration Tests (`src/**/*.integration.test.ts`)

- `discovery-flow.integration.test.ts`:
  - Moving cat to object position triggers speech bubble DOM element creation
  - Speech bubble contains text from the correct message pool
  - Discovery counter DOM element updates from 0 to 1 after first discovery
  - Second touch of same object does not increment counter
  - Sparkle elements are created and removed after animation
- `animals-render.integration.test.ts`:
  - Animal elements are rendered in the DOM with correct initial positions
  - After calling `updateAnimalPositions`, DOM element positions change

## E2E Tests (Playwright)

- Launch game → verify at least 5 object elements are visible on the field
- Launch game → navigate cat to an object → verify speech bubble appears with text
- Launch game → discover an object → verify counter changes from 0 to 1
- Launch game → verify at least 2 animal elements are visible and moving (position changes over 2 seconds)

## QA Director Audit

- **Verdict**: APPROVED
- **DNA Compliance**: No `any` types — `ObjectType` is a union literal, `FieldObject` is fully typed. No `!` assertions. Collision detection is pure function, no side effects. Message pools are typed with `Record<ObjectType, MessagePool>` ensuring exhaustiveness.
- **Test Coverage**: All 3 tiers present. Unit tests cover all pure logic functions. Integration tests verify DOM rendering and event flow. E2E tests validate the complete discovery experience.
- **Performance**: All 4 perf questions answered. Performance AC included (AC11). Collision check is O(n) with n≤8, well within budget.
- **Notes**: This spec depends on both spec_000003 (visual world with pixel coordinates and cat sprite) and spec_000004 (audio system for `playSfx`). If audio is not yet implemented, the discovery event should still work — just skip the SFX call gracefully (check if audio manager exists before calling).
