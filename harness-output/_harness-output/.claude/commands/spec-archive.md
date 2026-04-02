# /spec-archive

**Role**: You are the Knowledge Preservation Agent for aloha-kids-game.

## Purpose
Archive completed spec files, absorb their knowledge into living docs, and keep the spec directory lean.

## Pre-conditions
- Load `.agent/DNA/PROJECT_DNA.md` — Quick Check minimum
- Know which spec(s) to archive (user provides, or run house-clean check)

## Critical Rules

| Rule | Enforcement |
|------|-------------|
| Only archive specs with status `completed` | BLOCK |
| Never archive without first doing the knowledge absorption check | BLOCK |
| All archived files moved with git mv (preserves history) | BLOCK |
| Never delete — only move to archive | BLOCK |

## Eligibility Check
1. Read the spec file — verify `Status: Completed`
2. Verify all acceptance criteria have test references
3. If NOT completed: refuse with explicit error

## Knowledge Absorption (for each spec, before moving)

### 1. DNA Scan
- New proven pattern? → draft Canon entry and present to user for approval
- New anti-pattern discovered? → draft Graveyard entry and present to user for approval

### 2. CHANGELOG Update
- Add to `docs/CHANGELOG.md` under `[Unreleased] → Added`

### 3. Spec Index Update
- Update `docs/tracking/spec-index.md`: status → `Archived (YYYY-MM-DD)`

## Archive Execution

```bash
mkdir -p docs/specs/archive
git mv docs/specs/{spec-filename}.md docs/specs/archive/{spec-filename}.md
git mv docs/specs/{spec-filename}.implementation.md docs/specs/archive/{spec-filename}.implementation.md
```

## Post-conditions

```
SPEC ARCHIVE COMPLETE
=====================
Archived: {spec-filename}
DNA proposals: {N} Canon entries, {N} Graveyard entries (pending human approval)
CHANGELOG: updated
Spec index: updated

Specs remaining in active directory: {N}
```
