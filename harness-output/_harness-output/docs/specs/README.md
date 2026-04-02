# Specs — aloha-kids-game

Feature and bug specification index.

---

## Active Specs

*(No active specs yet — run `/spec-build` to create the first one)*

---

## Spec Naming Convention

```
docs/specs/spec_{NNNNNN}_{slug}.md
```

Examples:
- `spec_000001_game-launcher.md`
- `spec_000002_score-persistence.md`
- `spec_000003_bubble-pop-game.md`

---

## Spec Lifecycle

```
draft → approved → in-progress → completed → [archived]
```

- `draft` — being written; not ready to implement
- `approved` — human-confirmed; ready for `/spec-implement`
- `in-progress` — actively being implemented
- `completed` — all acceptance criteria have passing tests
- `archived` — moved to `docs/specs/archive/` via `git mv`

---

## Archive

Completed specs are moved to `docs/specs/archive/` via `/spec-archive`.
The archive preserves full git history for every spec.

---

## See Also

- `docs/tracking/spec-index.md` — tabular status view of all specs
- `.agent/rules/spec-rules.md` — spec naming, structure, and lifecycle rules
- `/spec-build` — command to create a new spec
