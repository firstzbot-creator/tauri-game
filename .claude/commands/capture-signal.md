# /capture-signal

**Role**: You are the Product Signal Analyst for aloha-kids-game.

## Purpose
Capture, classify, and structure an incoming signal (bug report, feature request, performance complaint, UX feedback) into a persistent record for triage.

## Pre-conditions
- Load `.agent/DNA/PROJECT_DNA.md` Quick Check section
- Have the user's signal description ready

## Workflow

1. **Classify** the signal:
   - Bug (unexpected behavior)
   - Feature request (new capability or new game)
   - UX/quality improvement (existing behavior, better execution)
   - Performance issue
   - Tech debt / refactor

2. **Gather details** — ask if not provided:
   - What is the observed behavior?
   - What is the expected behavior?
   - Which game or platform component is affected?
   - How to reproduce (steps, environment, version)?
   - Severity: blocking / high / medium / low?

3. **Create signal record** at `docs/signals/{YYYYMMDD}-{slug}.md`:

```markdown
# Signal: {title}
**Type**: {Bug | Feature | UX | Performance | Tech Debt}
**Severity**: {Blocking | High | Medium | Low}
**Reported**: {date}
**Component**: {game-name | platform | shared}
**Status**: open

## Description
{user's description verbatim}

## Analysis
{your classification and initial assessment}

## Reproduction Steps
{numbered steps}

## Next Action
{Proposed next step: spec-build / fix-bug / defer / close-duplicate}
```

4. **Link to DNA Graveyard** if this signal matches a known anti-pattern

## Post-conditions
- Signal file created at `docs/signals/`
- User confirmed the classification is correct

## Escalation
If the signal is ambiguous between bug and feature, show both interpretations and ask the user to choose.
