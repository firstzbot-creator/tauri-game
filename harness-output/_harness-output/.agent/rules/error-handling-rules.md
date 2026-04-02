# Error Handling Rules — aloha-kids-game

**Stack**: TypeScript / Tauri
**Applies to**: All production TypeScript files across game SPAs and platform shell

---

## Core Rules (BLOCK)

| Rule | Enforcement |
|------|-------------|
| Never swallow errors with empty `catch` blocks | BLOCK |
| Never use `as SomeType` without a preceding type guard | BLOCK |
| Never use `!` (non-null assertion) on values from Tauri IPC or user input | BLOCK |
| Async functions must handle rejection — no fire-and-forget `invoke(...)` without `.catch()` | BLOCK |
| Errors must carry context — log or rethrow with the operation name and inputs | BLOCK |

---

## Forbidden Patterns

```typescript
// FORBIDDEN: swallows the error
try {
  await saveScore(score);
} catch (_) {}

// FORBIDDEN: unchecked cast
const state = rawData as GameState;

// FORBIDDEN: fire-and-forget IPC
invoke('save_score', { score }); // no await, no catch

// FORBIDDEN: non-null assertion on external data
const name = player!.name; // player came from IPC
```

---

## Required Patterns

### Result Type for Fallible Operations

```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

async function loadGameConfig(gameId: string): Promise<Result<GameConfig>> {
  try {
    const raw = await invoke<unknown>('load_game_config', { gameId });
    if (!isGameConfig(raw)) {
      return {
        ok: false,
        error: new Error(`load_game_config: invalid response for gameId=${gameId}`),
      };
    }
    return { ok: true, value: raw };
  } catch (e) {
    return {
      ok: false,
      error: new Error(`load_game_config failed for gameId=${gameId}: ${String(e)}`),
    };
  }
}
```

### Error Context Pattern

Always include operation name and relevant inputs in error messages:

```typescript
// Good: identifies what failed and with what input
throw new Error(`parseScore: expected number, got ${typeof raw} — input: ${JSON.stringify(raw)}`);

// Bad: no context
throw new Error('Invalid input');
```

### Type Guard Before Cast

```typescript
function isGameConfig(value: unknown): value is GameConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).maxLevel === 'number'
  );
}

// Now safe to use
const config = await loadGameConfig('bubble-pop');
if (!config.ok) {
  logger.error('game_load_failed', { error: config.error.message });
  return;
}
// config.value is typed as GameConfig here
```

### Tauri IPC Error Handling

```typescript
async function saveScore(gameId: string, score: number): Promise<Result<void>> {
  try {
    await invoke<void>('save_score', { gameId, score });
    return { ok: true, value: undefined };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      error: new Error(`save_score(gameId=${gameId}, score=${score}) failed: ${msg}`),
    };
  }
}
```

---

## Error Propagation Rules

1. **At the boundary** (Tauri IPC entry/exit): convert to `Result` type
2. **In game logic**: propagate `Result` up the call chain; do not convert to exceptions
3. **At the UI layer**: consume the `Result` and show user-facing feedback; log the error
4. **In event handlers**: log the error and reset to a safe state; never let game crash

---

## Logging Errors

Use structured, tagged logging — not `console.error`:

```typescript
// Good
logger.error('score_save_failed', { gameId, score, error: result.error.message });

// Bad
console.error('Failed to save score', error);
```

Add the logger module path to `PROJECT_DNA.md` once the logger is implemented.

---

## Stack Trace Preservation

When rethrowing, preserve the original stack:

```typescript
try {
  await riskyOperation();
} catch (e) {
  throw new Error(`riskyOperation failed in context X: ${String(e)}`, { cause: e });
}
```
