# Coding Rules — aloha-kids-game

**Stack**: TypeScript / Tauri / Vite
**Applies to**: All production TypeScript source files across all game SPAs and the platform shell

---

## Critical Rules (BLOCK)

| Rule | Enforcement | Rationale |
|------|-------------|-----------|
| No `any` type in game logic or platform code | BLOCK | `any` silently disables type checking; use `unknown` + type guard instead |
| No bare `catch` that swallows errors | BLOCK | `catch (e) {}` or `catch (e) { return null }` hides failures; always log or rethrow with context |
| No `!` non-null assertions in game state | BLOCK | Assertion bypasses the type system; use optional chaining or an explicit guard |
| No `console.log` in production code paths | BLOCK | Use the project logger (structured, tagged); raw logs cannot be filtered or disabled |
| Async functions must handle rejection | BLOCK | Unhandled promise rejections crash Tauri; always `await` with try/catch or `.catch()` |
| No direct DOM mutation outside component lifecycle | BLOCK | Bypasses the framework's reconciliation; causes invisible state corruption |

## Style Rules (WARN)

| Rule | Enforcement | Rationale |
|------|-------------|-----------|
| Prefer `const` over `let`; avoid `var` | WARN | Immutability at declaration reduces accidental mutation |
| Function parameters > 3 → use a config object/interface | WARN | Many parameters indicate missing abstraction; config objects are self-documenting |
| Max function body length: 40 lines | WARN | Functions longer than 40 lines are hard to test and review |
| Exported names must be PascalCase (types/classes) or camelCase (functions/vars) | WARN | Consistent naming reduces cognitive load |
| No magic numbers in game logic | WARN | Extract to named constants: `const MAX_LIVES = 3` not `if (lives > 3)` |

---

## TypeScript Patterns

### Error Handling — Result Pattern

Prefer explicit Result types for operations that can fail:

```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

function parseGameState(raw: unknown): Result<GameState> {
  if (!isGameState(raw)) {
    return { ok: false, error: new Error(`Invalid game state: ${JSON.stringify(raw)}`) };
  }
  return { ok: true, value: raw };
}
```

**Forbidden**:
```typescript
// Silent fallback — fails C-DNA UB1
function parseGameState(raw: unknown): GameState {
  return raw as GameState; // BLOCK: unchecked cast
}
```

### Tauri IPC Calls

Always type Tauri invoke calls and handle errors explicitly:

```typescript
import { invoke } from '@tauri-apps/api/tauri';

async function saveScore(score: number): Promise<Result<void>> {
  try {
    await invoke<void>('save_score', { score });
    return { ok: true, value: undefined };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
  }
}
```

### Type Guards

Use type guards instead of type assertions:

```typescript
function isGameState(value: unknown): value is GameState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'score' in value &&
    'level' in value
  );
}
```

---

## Forbidden Patterns

| Pattern | Why | Alternative |
|---------|-----|-------------|
| `value as SomeType` without a preceding type guard | Unchecked cast — runtime explosion | Write an `isSomeType` guard first |
| `(window as any).gameState` | Bypasses types and pollutes global scope | Use typed module exports or Tauri state |
| `setTimeout(() => { /* game logic */ }, 0)` | Unpredictable timing in game loops | Use `requestAnimationFrame` or game tick system |
| `JSON.parse(str)` without try/catch | Throws on malformed input with no context | Wrap in a safe parse utility that returns `Result` |
| Shared mutable state across game modules | Creates invisible coupling between games | Each game owns its state; communicate via typed events |

---

## File and Module Organisation

- One concern per file — game logic, rendering, and state are separate modules
- Game SPAs live under `apps/{game-name}/src/`
- Platform shell lives under `src/` (or `src-tauri/` for Rust)
- Shared utilities live under `packages/shared/`
- No circular imports — if A imports B and B imports A, extract a shared module C

---

## Pre-Commit Checklist

Before committing TypeScript changes:
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npx vitest run` passes with zero failures
- [ ] No `any`, `!`, or bare `catch` introduced (grep to verify)
- [ ] No `console.log` in production paths
