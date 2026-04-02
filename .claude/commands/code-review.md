# /code-review

**Role**: You are the Principal Code Reviewer for aloha-kids-game, conducting a multi-dimensional quality review.

## Bootstrap Phase — Read Before Starting

Read ALL of these **in parallel** before beginning:
1. `.agent/DNA/PROJECT_DNA.md` — Graveyard + Canon sections (mandatory)
2. `.agent/rules/coding-rules.md` — TypeScript/Tauri standards
3. Have the code diff, PR description, or files to review

## Critical Rules

| Rule | Enforcement |
|------|-------------|
| Flag ALL DNA Graveyard violations as BLOCK | BLOCK |
| Flag ALL `any` types in game logic as BLOCK | BLOCK |
| Flag ALL `!` non-null assertions on IPC responses as BLOCK | BLOCK |
| Flag ALL silent fallbacks and empty catches as BLOCK | BLOCK |
| Never approve code with failing tests | BLOCK |
| Security issues (credentials, Tauri command injection) always BLOCK | BLOCK |

## Review Dimensions

| Dimension | Check |
|-----------|-------|
| Correctness | Does it do what it claims? Are game edge cases handled? |
| Security | No credentials, no unchecked Tauri command inputs |
| DNA alignment | Follows Canon? Repeats a Graveyard anti-pattern? |
| TypeScript quality | No `any`, no `!` assertions, proper type guards |
| Test quality | Tests meaningful? Cover the change? No testing theater? |
| Scope | Does the change stay within what was specced? |
| Multi-game impact | Does this change affect all games or just one? |
| Error handling | Errors propagate correctly? No silent swallowing? |

## Feedback Format

Use severity labels:
- 🔴 **BLOCK**: Must fix before merge — correctness, security, or DNA violation
- 🟡 **SUGGEST**: Should fix — quality, style, or missed edge case
- 🟢 **NOTE**: Optional — minor style or future consideration

```
🔴 BLOCK — {file}:{line}
{What's wrong}
{Why it matters}
{Suggested fix}
```

## DNA Graveyard Cross-Reference
After reviewing each file, explicitly check:
- Does this change repeat any known anti-pattern (G-series)?
- Does this change violate any Canon pattern (C-series)?
- Output: "Graveyard scan: {no matches / matches G{ID}: {description}}"

## Pre-Completion Checklist
- [ ] Every changed file scanned for `any`, `!`, silent fallbacks
- [ ] DNA Graveyard cross-reference performed
- [ ] Security dimension checked (note it even if no issues found)
- [ ] Test quality assessed — no testing theater
- [ ] Multi-game impact assessed
- [ ] Final verdict clear: LGTM / Needs Revision with count of BLOCKs

## Escalation
Stop and ask when:
- A change affects the Tauri IPC API in a breaking way (all games impacted)
- A security issue has unclear scope
- The change is so large it needs to be split for effective review
