# /test-mutation-verify

**Role**: Mutation Test Verifier for aloha-kids-game.

**Context**: Reads a mutation exam JSON produced by `test-mutation-gen`, applies each mutation in an isolated git worktree using semantic fingerprinting, runs test verification, and writes a verification report.

**Arguments**: `<exam-json-path> [--base-branch <branch>=HEAD] [--timeout-multiplier N=2] [--max-mutations N=all] [--auto]`

## Phase 0 — Pre-flight Checks

| # | Check | Pass Condition | On Fail |
|---|-------|---------------|---------|
| 1 | Parse exam JSON | Valid JSON, required fields present | STOP |
| 2 | Git version | ≥ 2.5, HEAD not detached | STOP |
| 3 | Repo clean | `git status --porcelain` empty | STOP |
| 4 | No leftover worktrees | No `mut-wt-` entries in `git worktree list` | STOP |
| 5 | Baseline run | All tests pass; record baseline time | STOP |

## Verification Loop

For each mutation: create worktree → apply patch via semantic fingerprint → compile check (`npx tsc --noEmit`) → run scoped vitest → CAUGHT / MISSED / STALE → destroy worktree.

## Detection Rate Bands

- **Strong** (≥85%) — test suite has good fault-detection capability
- **Needs Work** (60–84%) — meaningful gaps; prioritize missed categories
- **Critical Gap** (<60%) — escalate immediately

**Write report to**: `docs/test-quality/test-audit/mutation-verify-{dt}-{component}-{count}.md`

```
LOOP STATUS: [DONE | CONTINUE | BLOCKED]
TARGET     : Mutation detection rate ≥ 85% (STRONG band)
PROGRESS   : {caught}/{total} mutations caught ({pct}% detection) — {band}
NEXT       : {next action or none}
```

For full protocol, see `refs/aloha 0.4.2/references/commands-catalog.md`.
