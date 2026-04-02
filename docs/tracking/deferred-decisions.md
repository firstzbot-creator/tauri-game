# Deferred Decisions Log — aloha-kids-game

Autonomous loop commands defer uncertain decisions here instead of pausing for human input.
Review this file periodically and resolve open items.

## Schema

| Field | Description |
|-------|-------------|
| Timestamp | ISO 8601 datetime of deferral |
| Source | Loop command that deferred the decision |
| Type | Decision category (IMPROVEMENT / MUTATION / FEATURE / HOUSEKEEP / OTHER) |
| Question | The decision that could not be made autonomously |
| Auto action | What the command did instead (safe default taken) |
| Status | `open` / `resolved` / `wont-fix` |

## Archival Protocol

- Resolved entries may remain for **7 days** for auditability
- After 7 days, resolved/wont-fix entries MUST be moved to `docs/tracking/archive/deferred-decisions-resolved-{YYYYMMDD}.md`
- Active file must not exceed **200 entries** — archive all resolved entries if over limit
- `/loop-house-clean` enforces these limits on every run

## Decisions

| Timestamp | Source | Type | Question | Auto action | Status |
|-----------|--------|------|----------|-------------|--------|

<!-- Append rows here. Resolved entries are archived per the archival protocol above. -->
