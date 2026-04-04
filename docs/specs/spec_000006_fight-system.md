---
id: spec_000006
title: Fight System & First Boss
status: completed
created: 2026-04-03
author: agent
game: cat-adventure
---

## Problem Statement

Cat Adventure is currently a peaceful exploration game with no challenge or conflict. Kids aged ~10 need an exciting but warm combat experience that makes them feel brave and powerful. The fight system introduces a single boss on the map — a coyote — and gives the cat a simple attack action. This is the foundation for a future gear system, so the architecture must be modular and extensible.

---

## Scope

### IN scope
- Boss entity placed on the map (1 boss: Coyote — image from llm-gen technical)
- Player health bar + boss health bar (HUD overlay)
- Attack action triggered by Space bar
- Simple damage system (player deals fixed damage, boss deals fixed damage)
- Boss AI: idle until player enters range, then approaches and attacks on cooldown
- Hit visual feedback (red flash on damage, screen shake)
- Hit SFX (player attack sound, boss attack sound, victory jingle, defeat sound)
- Victory celebration (particles, message, boss disappears)
- Defeat screen (encouraging message + "Try Again" button)
- Combat state machine: `exploring` → `fighting` → `victory` | `defeated`
- Boss proximity trigger (enter range → fight begins, camera does not change)
- Boss stays defeated for the session
- Attack cooldown (prevents spam)

### OUT of scope
- Gear / equipment system (deferred to future spec)
- Multiple bosses or boss selection
- Multiplayer combat
- Weapon types or special abilities
- Level-up / XP system
- Boss phases (behavior changes at half HP)
- Floating damage numbers
- Inventory UI
- Persisting boss defeat across sessions (save/load)
- Canvas or WebGL rendering (stays DOM/CSS)

---

## Architecture

### New Modules

| Module | File | Responsibility |
|--------|------|----------------|
| Fight types | `src/fight-types.ts` | All combat-related TypeScript types |
| Combat engine | `src/combat.ts` | Damage calculation, combat state machine, attack logic |
| Boss entity | `src/boss.ts` | Boss creation, rendering, position, AI movement |
| Boss AI | `src/boss-ai.ts` | Boss behavior: idle, approach, attack patterns |
| Fight HUD | `src/fight-hud.ts` | Health bars, fight status UI |
| Fight effects | `src/fight-effects.ts` | Visual feedback: flash, shake, particles |

### Modified Modules

| Module | Change |
|--------|--------|
| `src/main.ts` | Integrate fight system into game loop, add Space bar handler |
| `src/audio.ts` | Add fight SFX names to `SfxName` type |
| `src/state.ts` | Add `CombatPhase` to game state |
| `src/game.css` | Add fight-related CSS classes |

### Type Design

```typescript
// fight-types.ts

export type CombatPhase = 'exploring' | 'fighting' | 'victory' | 'defeated';

export type HealthPoints = number; // 0–maxHp

export type CombatEntity = {
  hp: HealthPoints;
  maxHp: HealthPoints;
  attackDamage: number;
  attackCooldownMs: number;
  lastAttackTime: number;
};

export type BossId = string;

export type BossState = {
  id: BossId;
  position: Position;
  facing: Facing;
  size: number;
  entity: CombatEntity;
  defeated: boolean;
};

export type FightState = {
  phase: CombatPhase;
  playerEntity: CombatEntity;
  boss: BossState;
};

export type AttackResult = {
  hit: boolean;
  damage: number;
  attackerPosition: Position;
  defenderPosition: Position;
  timestamp: number;
};
```

### State Machine

```
EXPLORING ──(player enters boss range)──► FIGHTING
FIGHTING ──(boss HP <= 0)──► VICTORY
FIGHTING ──(player HP <= 0)──► DEFEATED
VICTORY ──(auto after 3s)──► EXPLORING (boss gone)
DEFEATED ──(player clicks "Try Again")──► EXPLORING (full heal, boss resets)
```

### Combat Engine Design

**Attack cooldown**: Player has a 600ms cooldown. Boss has a 1500ms cooldown. This gives the kid time to dodge.

**Damage model**:
- Player attack: 10 damage per hit
- Boss attack: 5 damage per hit
- Player HP: 50
- Boss HP: 80
- Boss engagement range: 120px (proximity trigger)
- Boss attack range: 70px (must be close to hit)

**Damage calculation** is a pure function:

```typescript
function calculateAttack(
  attacker: CombatEntity,
  defender: CombatEntity,
  attackerPosition: Position,
  defenderPosition: Position,
  attackRange: number,
  now: number,
): AttackResult
```

Returns `AttackResult` with `hit: false` if out of range or on cooldown, `hit: true` with damage otherwise.

### Boss AI Design

```typescript
type BossBehavior = 'idle' | 'approaching' | 'attacking';

function updateBossAI(
  boss: BossState,
  playerPosition: Position,
  now: number,
): BossState
```

- **Idle**: Boss sits still. When player enters engagement range (120px), transitions to `approaching`.
- **Approaching**: Boss moves toward player at 1px/frame. When within attack range (70px), transitions to `attacking`.
- **Attacking**: Boss attacks on its cooldown timer. Stays in this state while player is in range.

### Fight HUD Design

Two health bars rendered as DOM elements overlaid on the game field:

- **Player HP bar**: Top-left corner, green bar, shows cat icon
- **Boss HP bar**: Top-center, red bar, shows boss name ("Coyote")
- **Fight status text**: "FIGHT!" appears briefly when combat starts

### Visual Effects

- **Hit flash**: Entity background flashes red for 200ms on damage
- **Screen shake**: Field container shakes for 300ms on player hit (CSS animation)
- **Victory particles**: Golden sparkles burst from boss position
- **Boss defeat animation**: Boss shrinks and fades out over 500ms
- **Attack animation**: Cat does a small lunge forward (CSS transform) for 150ms

### SFX Additions

New `SfxName` values:

```typescript
type SfxName = 'meow' | 'chime' | 'rustle' | 'discovery'
  | 'player-attack'   // whoosh sound
  | 'boss-hit'        // squelch/splat sound
  | 'player-hit'      // oof sound
  | 'victory-jingle'  // celebration melody
  | 'defeat-sound';   // gentle descending tone
```

### Integration with Existing Code

The fight system integrates at the `main.ts` level:

1. **Initialization**: Create `FightState` alongside existing `CatState`
2. **Boss rendering**: Add boss element to the field alongside animals and objects
3. **Game loop**: The existing `requestAnimationFrame` loop for animals also drives boss AI
4. **Input**: Space bar triggers player attack (alongside existing arrow key movement)
5. **Phase gating**: During `fighting` phase, movement still works (player can dodge)
6. **Collision**: Boss proximity check runs alongside existing object collision check

### Key Constraints

- No `requestAnimationFrame` changes to the main game loop — boss AI runs in the existing animal animation loop
- No shared mutable state — all state flows through `FightState` with immutable updates
- Boss entity follows same rendering patterns as animals (absolute-positioned DOM element)
- Health bars are DOM elements with CSS transitions for smooth HP changes
- All fight logic is in pure functions testable with Vitest

---

## Acceptance Criteria

1. **AC1**: A boss entity (coyote, image-based) appears at a fixed position on the game field at session start
2. **AC2**: When the cat moves within 120px of the boss, combat begins — the HUD (health bars) appears and a "FIGHT!" message flashes
3. **AC3**: Pressing Space bar while in `fighting` phase deals 10 damage to the boss, with a 600ms cooldown between attacks
4. **AC4**: The boss moves toward the cat at ~1px/frame and attacks when within 70px, dealing 5 damage on a 1500ms cooldown
5. **AC5**: Both health bars update in real-time with smooth CSS transitions; player HP is green, boss HP is red
6. **AC6**: When the cat is hit, the screen shakes for 300ms and the cat flashes red; a hit SFX plays
7. **AC7**: When the boss is hit, the boss flashes red and a hit SFX plays
8. **AC8**: When boss HP reaches 0, a victory celebration plays (golden particles, victory jingle), the boss fades out, and the player returns to `exploring` phase after 3 seconds
9. **AC9**: When player HP reaches 0, a defeat overlay appears with an encouraging message ("So close! Try again!") and a "Try Again" button; clicking it fully heals the player, resets the boss, and returns to `exploring`
10. **AC10**: During `fighting` phase, the player can still move with arrow keys to dodge boss attacks
11. **AC11**: The boss stays defeated for the rest of the session (does not respawn)
12. **AC12**: Attack cooldown is visually indicated — the cat's attack animation only plays when off cooldown
13. **AC13**: All combat uses pure functions with no `any` types, no `!` assertions, and no silent fallbacks
14. **AC14**: Boss AI update + damage calculation completes in ≤2ms per frame (no frame jank)
15. **AC15**: When the cat moves more than 200px away from the boss during `fighting` phase, combat ends (phase returns to `exploring`), the boss returns to idle at its spawn position, and the player keeps their current HP

---

## Performance Design

1. **Latency-sensitive operations**: Boss AI position update (runs every frame), damage calculation (runs on attack input)
2. **Performance envelope**: Boss AI update ≤ 2ms per frame; attack response ≤ 16ms (one frame at 60fps)
3. **Throughput concerns**: None — single player, single boss, no network
4. **Regression signals**: Frame time spikes > 16ms during combat; health bar transitions stuttering

**Performance AC (AC14)**: Boss AI update + damage calculation completes in ≤2ms per frame under normal gameplay

---

## Verification

### Unit Tests

| Test | File | Description |
|------|------|-------------|
| Combat entity creation | `combat.test.ts` | Creates valid `CombatEntity` with correct HP, damage, cooldown |
| Damage calculation — hit | `combat.test.ts` | Attack within range and off cooldown returns `hit: true` with correct damage |
| Damage calculation — miss (out of range) | `combat.test.ts` | Attack beyond range returns `hit: false` |
| Damage calculation — cooldown | `combat.test.ts` | Attack during cooldown returns `hit: false` |
| Combat phase transitions | `combat.test.ts` | Phase transitions: exploring → fighting → victory, exploring → fighting → defeated |
| HP cannot go below zero | `combat.test.ts` | Damage reduces HP to 0 minimum, never negative |
| Boss AI — idle state | `boss-ai.test.ts` | Boss stays idle when player is far |
| Boss AI — approaching | `boss-ai.test.ts` | Boss moves toward player when in engagement range |
| Boss AI — attack range | `boss-ai.test.ts` | Boss attacks when within attack range and off cooldown |
| Boss AI — cooldown respected | `boss-ai.test.ts` | Boss does not attack during cooldown |
| Boss creation | `boss.test.ts` | Creates boss at specified position with correct initial state |
| Boss defeat flag | `boss.test.ts` | Defeated boss is marked as defeated |
| Fight state initialization | `fight-hud.test.ts` | Creates correct initial fight state |
| Attack result — edge cases | `combat.test.ts` | Zero HP attacker, zero range, negative positions |
| Flee / disengage | `combat.test.ts` | Moving >200px from boss transitions `fighting` → `exploring`, boss resets to idle |
| HP preserved after flee | `combat.test.ts` | Player keeps current (damaged) HP after fleeing; no auto-heal |
| Boss returns to spawn on flee | `boss-ai.test.ts` | Boss position resets to spawn point when combat disengages |

### Integration Tests

| Test | File | Description |
|------|------|-------------|
| Fight flow: approach → fight → victory | `fight-flow.integration.test.ts` | Player approaches boss, combat starts, player attacks until victory |
| Fight flow: approach → fight → defeat → retry | `fight-flow.integration.test.ts` | Player takes enough damage to lose, retry resets state |
| Boss AI + combat engine integration | `fight-flow.integration.test.ts` | Boss AI updates produce valid combat states |
| Fight HUD rendering | `fight-hud.integration.test.ts` | Health bars render correctly in DOM, update on damage |

### E2E Tests

| Test | Description |
|------|-------------|
| Player fights and defeats boss | Full flow: move to boss → space bar attack → boss HP drops → boss defeated → victory screen |
| Player loses and retries | Full flow: take damage → HP reaches 0 → defeat screen → click retry → fight again |

---

## QA Director Audit

**Verdict: APPROVED**

### DNA Compliance Check
- No `any` types in code examples — PASS
- No `!` non-null assertions — PASS
- No silent fallbacks — PASS
- All code examples use pure functions — PASS
- Error handling patterns follow project rules — PASS (pure functions return `AttackResult`, no exceptions in combat logic)

### Test Tier Coverage
- **Unit tests**: 17 tests across 4 test files — PASS (covers all pure functions, edge cases, state transitions)
- **Integration tests**: 4 tests across 2 files — PASS (fight flow, HUD rendering)
- **E2E tests**: 2 tests — PASS (victory flow, defeat+retry flow)

### Issues Found and Resolved

| Issue | Severity | Status |
|-------|----------|--------|
| QA-1: Problem statement referenced "slime" instead of "coyote" | Medium | FIXED |
| QA-2: AC1 referenced "slime creature, emoji-based" | High | FIXED → "coyote, image-based" |
| QA-3: HUD referenced boss name "Slime King" | Medium | FIXED → "Coyote" |
| QA-4: Flee mechanic (CQ4) had no acceptance criterion | High | FIXED → Added AC15 |
| QA-5: No test for flee/disengage behavior | Medium | FIXED → Added 3 unit tests |
| QA-6: Missing test for HP preservation after fleeing | Medium | FIXED → Added to verification table |

### Multi-Game Impact Assessment
- **Impact**: Changes are contained within `cat-adventure` game SPA
- **Platform-level changes**: None — no Tauri IPC changes, no shared package changes
- **Other games**: No impact — fight system is game-specific
- **Audio SFX type**: `SfxName` union type in `audio.ts` is extended, but this is within cat-adventure only

---

## Critical Questions

| # | Question | Answer |
|---|----------|--------|
| CQ1 | Should the boss respawn after the player retries a defeat? | **Yes** — on retry, boss resets to full HP and the fight can happen again |
| CQ2 | Should the cat's movement speed change during combat? | **No** — same movement speed; dodge by walking away |
| CQ3 | What visual represents the boss? | **Coyote**: image asset generated via llm-gen technical (SVG/PNG), rendered as an `<img>` element like the cat sprite |
| CQ4 | Can the player flee from combat? | **Yes** — moving far enough away (>200px) resets boss to idle and ends combat (player keeps current HP) |
| CQ5 | Where on the map does the boss spawn? | **Fixed position**: bottom-right quadrant (x: 600, y: 420), away from the cat's start position |

---

## Future Considerations (NOT in scope)

- **Gear system**: Will plug into `CombatEntity` by adding gear modifiers to `attackDamage` and `maxHp`
- **Multiple bosses**: `BossId` type supports this; boss registry pattern will be added later
- **Boss phases**: The `BossBehavior` type can be extended with phase-specific behaviors
- **Special abilities**: `AttackResult` can be extended with ability type and effects
