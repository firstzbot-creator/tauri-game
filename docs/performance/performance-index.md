# Performance Index — aloha-kids-game

Tracks which platform components and game modules have performance envelopes defined.

---

| Component | Envelope defined? | Target | Perf test file | Last verified |
|-----------|-------------------|--------|----------------|---------------|
| Platform shell (game picker) | No | ≤ 1s load | — | — |
| Game launcher (Tauri IPC) | No | ≤ 2s to playable | — | — |
| Score persistence (IPC) | No | ≤ 100ms save | — | — |
| *(add game components as they are built)* | — | — | — | — |

---

## Instructions

- When a spec defines a performance acceptance criterion, add a row here
- When a performance test is added, link the test file
- When a perf regression is caught, update "Last verified" and link the signal
- Run `/audit-tests` to surface components with no perf test coverage
