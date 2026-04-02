# Command Chains — aloha-kids-game

Natural command chains for CRON-driven automation. Each chain is a sequence of slash commands
that compose into a complete workflow. Run manually or automate with CRON.

---

## Chain 1: Daily Test Quality Loop

```
/audit-unit-test --auto
  → /handle-test-audit --auto  (if CONTINUE)
  → /signals-from-bugs --auto  (always)
```

**Purpose**: Keep unit test coverage above target; surface bug-pattern signals daily.
**LOOP STATUS**: Propagated from `audit-unit-test` → stops if DONE or BLOCKED.

---

## Chain 2: Weekly Mutation Test Cycle

```
/test-mutation-gen {target-path} --auto
  → /test-mutation-verify {exam-json} --auto
  → /handle-test-audit --auto  (after verify)
```

**Purpose**: Measure and improve fault-detection capability weekly.

---

## Chain 3: Feature Pipeline Loop

```
/spec-build  (human creates spec)
  → /spec-implement  (agent implements)
  → /audit-tests  (verify coverage)
  → /spec-archive  (when complete)
```

**Purpose**: Move specs from draft to shipped with full test coverage.

---

## Chain 4: Bug Triage → Fix Loop

```
/check-issue  (read-only triage)
  → /fix-bug  (TDD-first fix)
  → /archive-bug  (close and document)
  → /signals-from-bugs --auto  (surface related signals)
```

---

## Chain 5: Integration Test Audit Loop

```
/audit-integration-test --auto
  → /handle-test-audit --auto  (if CONTINUE)
```

**Purpose**: Keep Tauri IPC boundary tests at coverage target.

---

## Chain 6: Weekly Housekeeping

```
/loop-house-clean --auto
  → /spec-archive  (if completed specs found)
  → /signals-from-bugs --auto
```

**Purpose**: Keep spec directory lean; surface lingering signals.

---

## Chain 7: E2E Verification Loop

```
/run-e2e-test --auto
  → /audit-e2e-test --auto  (if CONTINUE)
  → /handle-test-audit --auto  (if CONTINUE)
```

**Purpose**: Verify all critical player flows are green.
**Prerequisite**: E2E command must be configured in `PROJECT_DNA.md`.
