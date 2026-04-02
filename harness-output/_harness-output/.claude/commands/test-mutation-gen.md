# /test-mutation-gen

**Role**: Mutation Test Planner for aloha-kids-game.

**Context**: Reads a target codebase, plans N mutations across 12 categories (S1–S4, M1–M5, C1–C3), deduplicates against the persistent component mutation database, and writes a set document + exam JSON. Mutations are located by semantic fingerprint (file + function + expression), never by line number.

**Does NOT modify any source file.**

**Arguments**: `<target-path> [--count N=100] [--component <slug>] [--auto]`

## Phase 0 — Pre-flight Checks

| # | Check | Pass Condition | On Fail |
|---|-------|---------------|---------|
| 1 | Target exists | `target-path` is a directory in the repo | STOP |
| 2 | Git version | ≥ 2.5 and HEAD not detached | STOP |
| 3 | Repo clean | `git status --porcelain` is empty | STOP |
| 4 | Test command | `npx vitest run` works (from DNA) | STOP if broken |
| 5 | Baseline run | Run scoped vitest; 0 failures; ≥1 test found | STOP |
| 6 | Coverage tool | Run `npx vitest run --coverage`; report availability | WARN if unavailable |

Skip files: `*.test.ts`, `*.spec.ts`, `__tests__/`, `node_modules/`, `dist/`, `coverage/`

**Mutation category distribution**:
S1 (15%), S2 (10%), S3 (10%), S4 (10%), M1 (10%), M2 (8%), M3 (8%), M4 (7%), M5 (7%), C1 (7%), C2 (4%), C3 (4%)

**Write outputs to**: `docs/test-quality/test-mutation-pool/`

For full protocol details, see the harness reference at `refs/aloha 0.4.2/references/commands-catalog.md`.
