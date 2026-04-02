# Spec Rules — aloha-kids-game

**Spec lifecycle**: `draft` → `approved` → `in-progress` → `completed` → `archived`

---

## Spec File Naming

```
docs/specs/spec_{NNNNNN}_{slug}.md
```
Example: `docs/specs/spec_000001_game-launcher.md`

---

## Required Sections (BLOCK if missing)

Every spec must include:
1. **Metadata block** — ID, title, status, date, author
2. **Problem statement** — why this feature is needed (user need, not implementation)
3. **Scope** — explicit IN scope and OUT of scope items
4. **Acceptance criteria** — numbered, testable, specific
5. **Verification** — unit tests, integration tests, E2E tests (or documented rationale for absence)
6. **Performance design** — answers to all 4 perf questions (or explicit "none")

---

## Performance Design (MANDATORY — BLOCK if absent)

Answer all 4 in the spec's Architecture/Design section:
1. Latency-sensitive operations? (name them or state "none")
2. Performance envelope? (ms/s target, or "none — no envelope defined")
3. Throughput concerns? (concurrent players, data volume, or "none")
4. Regression signals? (how to detect a perf regression, or "none — no signals defined")

Add one Performance Acceptance Criterion: `"Performance: {operation} completes in ≤{N}ms under {conditions}"`

---

## Lifecycle Rules

| Rule | Enforcement |
|------|-------------|
| Spec must remain `draft` until user explicitly approves | WARN |
| Never start implementation without an `approved` spec | BLOCK |
| All acceptance criteria must have passing tests before marking `completed` | BLOCK |
| Never delete spec files — use `git mv` to archive | BLOCK |
| Duplicate check before creating: grep existing spec titles | WARN |

---

## Spec Template (Metadata Block)

```markdown
---
id: spec_{NNNNNN}
title: {Feature title}
status: draft
created: {YYYY-MM-DD}
author: {name or agent}
game: {game-name | platform}
---
```

---

## Spec Index

Update `docs/tracking/spec-index.md` when:
- A spec is created (add as `Draft`)
- Implementation begins (update to `In Progress`)
- Spec is completed (update to `Completed`)
- Spec is archived (update to `Archived YYYY-MM-DD`)
