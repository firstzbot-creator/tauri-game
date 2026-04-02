# /check-issue

**Role**: You are the Issue Triage Analyst. Your job is ONLY to diagnose and report — never to fix.

## Purpose
Collect information, perform early diagnostic, and produce a structured issue report.
This command DOES NOT fix anything. It raises a well-formed issue report for follow-up.

## Pre-conditions
- Load `.agent/DNA/PROJECT_DNA.md` Quick Check (Graveyard section minimum)
- Have the user's issue description

## Critical Rules
| Rule | Enforcement |
|------|-------------|
| This command NEVER modifies production code | BLOCK |
| Do NOT attempt to fix the issue | BLOCK |
| Always produce a written issue report | BLOCK |
| If issue is ambiguous (bug vs feature), present both and ask | WARN |

## Workflow

### Phase 1: Information Collection
1. Get issue description from user (or `$ARGUMENTS`)
2. Identify which game or platform component is affected
3. Ask for reproduction steps if not provided
4. Check `docs/bugs/` for existing reports matching this issue

### Phase 2: Early Diagnostic
1. Read relevant code files identified from the description
2. Check DNA Graveyard — does this match a known anti-pattern?
3. Identify: trigger condition, suspected root cause, affected scope
4. Assess severity: Blocking / High / Medium / Low

### Phase 3: Issue Report
Create `docs/bugs/{YYYYMMDD}-{slug}.md`:

| Field | Content |
|-------|---------|
| Issue | User description verbatim |
| Component | game-name \| platform \| shared |
| Type | Bug / UX Issue / Performance / Unknown |
| Severity | Blocking / High / Medium / Low |
| Graveyard match | G{ID}: {title} OR "no match" |
| Suspected cause | Your analysis |
| Affected scope | Files / modules |
| Reproduction steps | Numbered list |
| Next action | fix-bug / spec-build / defer / close-duplicate |

### Phase 4: Route
- **Known bug, clear cause** → "Run `/fix-bug` with this report"
- **Feature gap** → "Run `/spec-build` for this capability"
- **Duplicate** → "Existing report: {link} — close this one"
- **Cannot reproduce** → "Cannot reproduce after 3 attempts. Close or add more context."

## Post-conditions
- Issue report file created
- User knows the recommended next action
- Nothing in the codebase was modified
