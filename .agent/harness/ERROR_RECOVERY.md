# Error Recovery — aloha-kids-game

**Pattern**: Doom-loop prevention, circuit breakers, structured escalation
**Industry sources**: Manus error-in-context, LangChain LoopDetection, 12-Factor circuit breakers

---

## Loop Detection Rules

An agent is in a doom loop when ANY of these are true:

| Signal | Threshold | Action |
|--------|-----------|--------|
| Same file edited 3+ times in a row without progress | 3 edits | STOP — write checkpoint, report to human |
| Same test fails after 3 fix attempts | 3 attempts | STOP — report what was tried, ask for guidance |
| Build command fails with the same error 3+ times | 3 failures | STOP — do not retry blindly |
| Grep returns no results for 3 variations of a pattern | 3 searches | STOP — ask human where the code lives |

**Never silently retry.** Each retry must differ from the last in a meaningful way.

---

## Error Preservation Rule

When an error occurs:
- **Keep the error in context** — do not remove it to "clean up"
- **Log the error with context** before attempting a fix
- **Append to progress.md** before attempting the next approach

Format:
```
[ERROR] {timestamp}: {what failed}
Attempted: {what was tried}
Result: {exact error message}
Next attempt: {what will be different}
```

---

## Circuit Breakers

| Operation | Max retries | On max reached |
|-----------|-------------|----------------|
| `npx vitest run` (test run) | 3 | Write checkpoint; report failing test name + output |
| `npx tauri build` | 2 | Report full build error; stop |
| Tauri IPC mock setup | 2 | Ask human for correct mock pattern |
| File write (harness or spec) | 2 | Verify directory exists; if still fails, ask human |

---

## Escalation Triggers (Always Stop and Ask Human)

- Cannot reproduce a reported bug after 3 attempts
- A fix requires changing a public API, Tauri command signature, or data schema
- The root cause is in a Tauri Rust backend file you cannot safely modify
- Two full QA rework cycles and spec QA is still blocking
- Context window is becoming large — write checkpoint and suggest fresh session
- A test requires mocking Tauri internals that are hard to stub

---

## Recovery After a Failed Session

When resuming after an interrupted session:

1. Read `progress.md` — identify the last completed step
2. Read `docs/tracking/spec-index.md` — check which spec was active
3. Read the implementation log (if present) — check YAML frontmatter for resume state
4. Run `npx vitest run` — verify the baseline is still green
5. Resume from the last checkpoint; do NOT restart from the beginning

---

## Approach Failure Protocol

If the current implementation approach is fundamentally wrong:
1. **STOP** immediately — do not attempt to salvage broken code
2. **Log**: what went wrong, why the approach failed, files modified
3. **Update YAML frontmatter** in the implementation log: `status: blocked`
4. **Report to human**: options (re-plan / revert / pause), your recommendation
5. **Wait** for human decision — do NOT auto-recover into a different approach

---

## Do Not Invent Workarounds

If a Tauri API behaves unexpectedly or is missing:
- Do not polyfill with `setTimeout` or global state
- Surface it as a signal: `docs/signals/{date}-tauri-api-gap.md`
- Ask the human before proceeding with an alternative approach
