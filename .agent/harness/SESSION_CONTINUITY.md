# Session Continuity — aloha-kids-game

**Pattern**: Progress files, feature list, git-based recovery, initializer protocol
**Industry sources**: Anthropic initializer pattern, Phil Schmid progress files

---

## Session Start Protocol (Initializer Pattern)

At the start of every session:
1. Read `progress.md` — identify last completed step and current work in flight
2. Read `feature_list.json` — check feature status (discovered / in-progress / done)
3. Run `npx vitest run` — verify baseline is green before starting new work
4. Check git state — branch name, uncommitted changes, recent commits
5. Read active spec (if any) — load from `docs/tracking/spec-index.md` to find which spec was in progress

Do not start new work if tests are red or working tree is unexpectedly dirty.

---

## Progress File (progress.md)

Update `progress.md` at these milestones:
- Session start (record what you're about to do)
- After completing each spec phase
- After each successful test run
- After any error or unexpected outcome
- Session end (record exactly where you stopped)

**Format**:
```markdown
## [YYYY-MM-DD HH:MM] {Event}
- Status: {what was completed}
- Tests: {pass count or FAIL + test name}
- Next: {exact next action}
```

---

## Feature List (feature_list.json)

The feature list is the authoritative status tracker for all platform and game features.

**Guard rule (C-INIT-21)**: The `_guard` key must always be the first key:
```json
{
  "_guard": "Never delete features — only advance status (discovered → in-progress → done)",
  "platform": {
    "game-launcher": "discovered",
    "score-persistence": "discovered"
  },
  "games": {}
}
```

**Status values**: `discovered` → `in-progress` → `done`
Never set a status backwards. Never delete a feature entry.

---

## Git-Based Recovery

Use descriptive commit messages so sessions can be resumed from git history:

```
feat(platform): add game launcher SPA scaffold [spec_000001]
test(score): add unit tests for score persistence module [spec_000002]
fix(ipc): handle invoke rejection in save_score command (B000001)
```

If a session ends mid-implementation:
1. Commit what is working with a `wip:` prefix: `wip(bubble-pop): score display partial`
2. Note the wip commit in `progress.md`
3. Next session: read the progress file, then `git log -5` to orient

---

## Implementation Log Recovery

If a spec implementation is interrupted:
1. The implementation log at `docs/specs/{spec-file}.implementation.md` has YAML frontmatter:
   ```yaml
   status: in-progress
   last_completed_phase: "Phase 2"
   last_completed_step: "Criterion 3 of 5: score capping test GREEN"
   ```
2. Resume from `last_completed_step` — do NOT restart Phase 1

---

## Multi-Game Continuity Note

Each game SPA is developed independently. If switching between games:
1. Write a checkpoint for the current game before switching
2. Load the new game's spec and source context fresh
3. Do not carry assumptions from Game A into Game B's context
