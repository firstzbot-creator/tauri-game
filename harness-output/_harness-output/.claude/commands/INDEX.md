# /index

All slash commands available in aloha-kids-game.

## Command Catalog

| Command | File | Phase | Description |
|---------|------|-------|-------------|
| `/bootstrap-context` | `bootstrap-context.md` | Bootstrap | Load DNA and orient at session start |
| `/capture-signal` | `capture-signal.md` | Requirements | Capture and classify a bug/feature signal |
| `/spec-build` | `spec-build.md` | Requirements | Draft and approve a feature spec (4-phase expert workflow) |
| `/architect-review` | `architect-review.md` | Architecture | Evaluate a design decision |
| `/spec-implement` | `spec-implement.md` | Implementation | Build a feature from an approved spec (TDD-first) |
| `/add-unit-test` | `add-unit-test.md` | Testing | Add unit test coverage to a module |
| `/add-integration-test` | `add-integration-test.md` | Testing | Add integration test coverage at Tauri IPC boundary |
| `/add-e2e-test` | `add-e2e-test.md` | Testing | Add E2E coverage for critical player flows |
| `/audit-tests` | `audit-tests.md` | Testing | Find coverage gaps and surface signals |
| `/handle-test-audit` | `handle-test-audit.md` | Testing | Process audit and mutation reports |
| `/test-mutation-gen` | `test-mutation-gen.md` | Testing | Plan mutation test set |
| `/test-mutation-verify` | `test-mutation-verify.md` | Testing | Apply mutations and measure detection rate |
| `/check-issue` | `check-issue.md` | Bug Management | Read-only triage before fixing |
| `/fix-bug` | `fix-bug.md` | Bug Management | Investigate and fix a bug (TDD-first) |
| `/archive-bug` | `archive-bug.md` | Bug Management | Archive a resolved bug |
| `/code-review` | `code-review.md` | Code Review | Review code for quality and DNA alignment |
| `/code-simplifier` | `code-simplifier.md` | Code Review | Reduce complexity without changing behavior |
| `/handle-signal` | `handle-signal.md` | Knowledge | Process an improvement signal |
| `/spec-archive` | `spec-archive.md` | Housekeeping | Archive completed specs and absorb knowledge |
| `/audit-unit-test` | `audit-unit-test.md` | Testing (Loop) | Audit unit test coverage; supports --auto chaining |
| `/audit-integration-test` | `audit-integration-test.md` | Testing (Loop) | Audit integration test coverage; supports --auto |
| `/audit-e2e-test` | `audit-e2e-test.md` | Testing (Loop) | Audit E2E critical flow coverage; BLOCKED if not configured |
| `/run-e2e-test` | `run-e2e-test.md` | Testing (Loop) | Execute E2E suite; supports --auto |
| `/signals-from-bugs` | `signals-from-bugs.md` | Bug Management (Loop) | Create signals from open bug docs; idempotent |

## Auto-Loop Commands

Located in `auto/`:

| Command | File | Interval | Description |
|---------|------|----------|-------------|
| `/loop-test-case-improve` | `auto/loop-test-case-improve.md` | daily | Test quality audit loop |
| `/loop-mutation-test` | `auto/loop-mutation-test.md` | weekly | Mutation testing loop |
| `/loop-feature-pipeline` | `auto/loop-feature-pipeline.md` | daily | Spec → implementation pipeline |
| `/loop-house-clean` | `auto/loop-house-clean.md` | weekly | Housekeeping loop |
| `/memory-hygiene` | `auto/memory-hygiene.md` | daily | Memory pruning |

## Removed Commands (and rationale)
- `/add-feature` — Use `/spec-build` for any feature, no matter how small. No spec = no safety net.
- `/create-adr` — ADR creation is embedded in `spec-implement` Phase 5.
- `/dna-update` — DNA updates are embedded in `fix-bug` Phase 6 and `spec-implement` Phase 5.
- `/update-changelog` — Changelog updates are embedded in `spec-archive` and `fix-bug`.
- `/create-release` — Not auto-generated; build once Tauri release pipeline is established.
