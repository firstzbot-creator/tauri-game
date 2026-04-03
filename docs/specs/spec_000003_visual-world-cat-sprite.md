---
id: spec_000003
title: Visual World & Cat Sprite
status: completed
created: 2026-04-02
author: Claude (spec-build)
game: cat-adventure
depends_on: spec_000002
---

# Problem Statement

The current Cat Adventure game renders a `🐱` emoji on a white background with raw JSON state display and plain HTML buttons. This is visually unappealing for children — it looks like a developer tool, not a game. Kids need a vibrant, living world with a recognizable cat character to feel immersed and motivated to explore.

# Scope

**IN SCOPE:**
- Grass field background filling the 800×600 game window (CSS gradient with layered texture)
- Decorative flowers (6-10) randomly placed on the field at game start
- Full-body cat sprite (PNG) replacing the emoji, sized ~64×64px
- Cat sprite flips horizontally to face movement direction
- Simple idle animation (CSS keyframe — gentle bounce or tail wag)
- Pixel-based coordinate system replacing the 0-10 grid (field is 800×600, cat moves in pixel increments)
- Smooth movement via CSS transition (cat glides to new position)
- Click-to-move: child clicks anywhere on the field → cat walks toward that point
- Arrow key movement retained (step size ~40px per keypress)
- Remove all debug UI: no JSON display, no "Save/Load" buttons on main screen, no status `<pre>`
- Field boundary clamping (cat cannot walk off-screen)

**OUT OF SCOPE:**
- Audio (see spec_000004)
- Interactive/touchable objects (see spec_000005)
- Wandering animals (see spec_000005)
- Day/night cycle
- Canvas-based rendering (staying with DOM + CSS for simplicity)
- Sprite sheet animation frames (keep it to CSS transforms for v1)
- Save/load of world flower positions (flowers re-randomize each session)

# Acceptance Criteria

1. Game launches showing a green grass field background covering the full 800×600 window
2. At least 6 decorative flower elements are visible on the field, placed at random positions each session
3. Cat is rendered as a full-body PNG sprite (~64×64px), not an emoji
4. Cat sprite faces right when moving right, faces left when moving left
5. Cat has a subtle idle animation (CSS keyframe) when stationary
6. Pressing arrow keys moves the cat by ~40px in the corresponding direction with a smooth transition
7. Clicking anywhere on the grass field causes the cat to move toward the clicked point
8. Cat position is clamped to field boundaries (cannot move off-screen)
9. No raw JSON, debug text, "Save State"/"Load State" buttons, or developer-facing UI is visible during play
10. **Performance**: Cat movement (arrow key or click-to-move) renders position update in ≤16ms to maintain 60fps

# Architecture & Design

## Coordinate System Change

The current 0-10 integer grid becomes a pixel-based system:

```typescript
type Position = { x: number; y: number };
type Facing = 'left' | 'right';

type CatState = {
  position: Position;  // pixel coordinates within 800×600 field
  facing: Facing;
  equippedHat: string;
};

const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 600;
const CAT_SIZE = 64;
const STEP_SIZE = 40;
```

## Module Design

### `world.ts` — World setup and decorative elements

```typescript
type FlowerPlacement = {
  position: Position;
  variant: number; // 0-3, selects which flower CSS class
};

function generateFlowers(count: number, fieldWidth: number, fieldHeight: number): FlowerPlacement[];
function renderWorld(container: HTMLElement, flowers: FlowerPlacement[]): void;
```

- `generateFlowers` uses `Math.random()` with boundary padding to avoid edge clipping
- `renderWorld` creates the grass background div and positions flower elements absolutely within it

### `cat.ts` — Cat rendering and animation

```typescript
function createCatElement(): HTMLElement;
function updateCatPosition(el: HTMLElement, position: Position, facing: Facing): void;
function calculateMoveTarget(current: Position, clickTarget: Position, stepSize: number): Position;
```

- `createCatElement` creates an `<img>` element with the cat sprite and idle animation class
- `updateCatPosition` sets CSS `left`/`top` and `scaleX(-1)` for left-facing
- `calculateMoveTarget` computes the next position toward a click target, clamped to field bounds

### Updated `state.ts` — Pixel-based movement

```typescript
function updatePosition(state: CatState, dir: Direction): CatState;
function moveToward(state: CatState, target: Position, stepSize: number): CatState;
function clampPosition(position: Position, fieldWidth: number, fieldHeight: number, catSize: number): Position;
```

### Updated `main.ts` — New init flow

- Creates world container, renders flowers, places cat
- Registers arrow key listeners (keydown → `updatePosition`)
- Registers click listener on field (click → `moveToward`)
- No save/load buttons in main UI (IPC remains for future use)

## Asset Strategy

- Cat sprite: single PNG file at `apps/cat-adventure/src/assets/cat.png` (~64×64, transparent background)
- Flower sprites: 3-4 small PNGs or pure CSS flower shapes using `border-radius` + gradients
- Grass texture: CSS gradient (`linear-gradient` layered with subtle noise pattern)
- All assets bundled via Vite's static asset handling

## Performance Design

1. **Latency-sensitive operations?** Yes — cat position update on keypress and click must feel instant
2. **Performance envelope?** ≤16ms for movement computation + DOM update (60fps target)
3. **Throughput concerns?** None — single player, DOM element count stays under 20
4. **Regression signals?** Measure time from keydown event to `transform` style application in integration tests

# Verification

## Unit Tests (`src/**/*.test.ts`)

- `world.test.ts`:
  - `generateFlowers` returns requested count with positions within bounds
  - `generateFlowers` applies padding so no flower is within 20px of field edge
  - `generateFlowers` returns different positions on successive calls (randomness check)
- `cat.test.ts`:
  - `calculateMoveTarget` moves cat toward click target by step size
  - `calculateMoveTarget` clamps result to field boundaries
  - `calculateMoveTarget` returns current position when already at target
- `state.test.ts` (updated):
  - `updatePosition` moves by STEP_SIZE pixels in correct direction
  - `updatePosition` clamps to field boundaries (0 to FIELD_WIDTH-CAT_SIZE, 0 to FIELD_HEIGHT-CAT_SIZE)
  - `moveToward` moves cat closer to target position
  - `moveToward` stops at target when within one step
  - `clampPosition` constrains position within field bounds

## Integration Tests (`src/**/*.integration.test.ts`)

- `world-render.integration.test.ts`:
  - `renderWorld` creates correct number of flower DOM elements inside container
  - Flower elements have absolute positioning within container bounds
  - Cat element updates `style.left`/`style.top` when `updateCatPosition` is called
  - Cat element has `scaleX(-1)` when facing is `'left'`

## E2E Tests (Playwright)

- Launch game → verify grass background is visible (no white background)
- Launch game → verify cat sprite image is loaded (not emoji text)
- Press right arrow → verify cat element moves rightward
- Click on field → verify cat element moves toward click point
- Move cat to right edge → press right arrow → verify cat doesn't leave field

## QA Director Audit

- **Verdict**: APPROVED
- **DNA Compliance**: No `any` types, no `!` assertions on external data, no silent fallbacks. All functions return typed values.
- **Test Coverage**: All 3 tiers present — unit tests for pure logic, integration tests for DOM rendering, E2E for visual/interaction validation.
- **Performance**: All 4 perf questions answered. Performance AC included (AC10).
- **Notes**: The coordinate system change from grid-based to pixel-based will require updating the existing `state.test.ts`. The IPC save/load types will need updating to handle pixel positions — but the IPC module itself is unchanged (just the `CatState` type flows through).
