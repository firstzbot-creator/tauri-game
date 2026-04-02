# Self-Learning — aloha-kids-game

**Pattern**: Pattern extraction from bugs/wins, DNA update protocol, knowledge decay detection
**Industry sources**: Phil Schmid harness-as-dataset, LangChain trace analysis

---

## When to Update DNA

Update `PROJECT_DNA.md` when:
- A bug fix reveals a pattern likely to recur → propose Graveyard entry
- An architectural decision is validated by passing tests and user approval → propose Canon entry
- A North Star value is challenged by a real trade-off → document as Tension
- A pattern is used successfully 2+ times → elevate to Canon with evidence

**Rule**: Never self-apply DNA updates. Always present the proposed entry to the human and wait for approval. CRITICAL-severity Graveyard entries always require explicit confirmation.

---

## Bug → Graveyard Protocol

After fixing a bug, assess:

1. **Local or systemic?**
   - Local: unique to this code path, unlikely to recur → standard bug report, no DNA action
   - Systemic: pattern that could appear in 2+ places or will likely recur → mandatory DNA action

2. **If systemic**:
   ```
   G{N}: {Pattern name}
   Severity: HIGH or CRITICAL
   Bug ref: B{NNNNNN}
   Why: {root cause — be specific, not generic}
   Example: {code snippet of the bad pattern}
   Fix: {what to do instead}
   ```
   Present to human. Apply only after approval.

---

## Win → Canon Protocol

After a successful feature ship or validated architectural decision:

1. Was the pattern non-obvious?
2. Is it specific to this project (not a generic best practice)?
3. Is it validated by real use (tests passing + user confirmation)?

If YES to all three: draft a Canon entry and present to human:
```
C{N}: {Pattern name}
Confidence: MEDIUM (new) | HIGH (used 2+ times) | PROVEN (embedded in tests)
Scope: platform | game-logic | IPC | testing
Added: {YYYY-MM-DD}
Context: {when this applies}
Pattern: {exactly what to do}
Anti-pattern: {what NOT to do}
```

---

## Knowledge Decay Detection

Flag stale Canon entries for review when:
- A Canon entry references a file path or function name that no longer exists
- A Canon entry's example code produces a lint error under the current stack
- A pattern has not been used in 3+ months and the codebase has evolved significantly

Decay signal format: `docs/signals/{date}-canon-decay-C{ID}.md`

---

## Trace Capture

Write skill execution traces to `.skill-traces/` per the protocols.md specification.
These traces are used for:
- Identifying which phases take the most time
- Detecting where agents deviate from the protocol
- Improving skill definitions in the next harness enhancement cycle

---

## Harness-as-Dataset

Every bug fix, spec, and implementation log is training data for future sessions.
Maintain them carefully:
- Bug reports: precise root cause, concrete example, specific fix
- Spec acceptance criteria: testable, numbered, not vague
- Canon entries: code examples that compile and run

A vague Graveyard entry ("don't do bad things") is useless.
A precise one ("never use `any` to suppress a Tauri IPC type mismatch — see B000003") teaches.
