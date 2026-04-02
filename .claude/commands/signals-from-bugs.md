# /signals-from-bugs

**Role**: Bug Pattern Signal Generator for aloha-kids-game.

**Arguments**: `[--auto]`

## Pre-conditions
- `docs/bugs/` — bug tracking documents
- `docs/signals/` — where signals are written (created if missing)

## Phase 1 — Scan
1. Read all `docs/bugs/` files with `status: open`
2. Build slug index from existing `docs/signals/`
3. Idempotency check: skip any bug whose slug already has a signal

## Phase 2 — Create Signal Files
For each unprocessed bug pattern, create `docs/signals/{date}-bug-pattern-{slug}.md`.
Without `--auto`: confirm before writing. With `--auto`: create immediately (new files only).

## Phase 3 — LOOP STATUS Output

```
LOOP STATUS: [CONTINUE | DONE]
TARGET     : All open bug patterns have a linked signal in docs/signals/
PROGRESS   : {new} new signals created; {remaining} open bugs without signal
NEXT       : {handle-signal | none}
```

## Idempotency Contract
Safe to run multiple times. Running twice on same state yields 0 new signals and LOOP STATUS: DONE.
