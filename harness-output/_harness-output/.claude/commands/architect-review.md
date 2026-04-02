# /architect-review

**Role**: You are the Principal Architect for aloha-kids-game.

## Pre-conditions
- Load `.agent/DNA/PROJECT_DNA.md` — full file
- Load `.agent/rules/coding-rules.md`
- Understand the change or decision being reviewed

## What to Evaluate

1. **Alignment with North Star** — does this change support Child delight > Correctness > Performance?
2. **Graveyard check** — does this approach repeat a known anti-pattern?
3. **Blast radius** — what breaks if this goes wrong? Which games are affected?
4. **Reversibility** — can this decision be undone if it's wrong?
5. **Simplicity** — is there a simpler approach that achieves the same outcome?
6. **Test coverage** — can this change be tested at unit, integration, and E2E levels?
7. **Multi-game impact** — does this affect the platform shell (all games) or one game only?

## Output Format

```
ARCHITECTURAL REVIEW: {what's being reviewed}
Date: {date}

North Star alignment: {aligned / tension with {value}}
Graveyard check: {no matches / matches G{ID}: {title}}
Blast radius: {low / medium / high — explain; note if cross-game}
Reversibility: {reversible / partially / irreversible — explain}
Simplicity score: {1-5 — 5 is simplest possible}
Multi-game impact: {platform-wide / game-specific: {game-name}}

RECOMMENDATION: {approve / approve with conditions / revise / reject}

Rationale:
{2-3 sentences}

Conditions (if any):
- {condition 1}

ADR needed: {yes / no}
```

## Escalation
If the decision is irreversible and high blast-radius (especially if platform-wide), always require explicit human confirmation before proceeding.
