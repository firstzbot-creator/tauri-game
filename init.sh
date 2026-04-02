#!/usr/bin/env bash
# init.sh -- Agent onboarding boot script for aloha-kids-game
# Run this at the start of every agent session to orient and verify.
#
# Usage: bash init.sh
# Or:    source init.sh  (to keep environment variables in current shell)
#
# Windows: requires Git Bash or WSL. Run: bash init.sh
#   Native PowerShell is not supported (no sh/bash built-in).

set -euo pipefail

PROJECT_NAME="aloha-kids-game"
BUILD_CMD="npx tauri build"
TEST_CMD="npx vitest run"
TYPE_CMD="npx tsc --noEmit"

echo "========================================"
echo " Agent Init: $PROJECT_NAME"
echo "========================================"
echo ""

# Step 1: Read progress file
if [ -f "progress.md" ]; then
    echo "[INIT] Progress file found:"
    head -20 progress.md
    echo "..."
    echo ""
else
    echo "[INIT] No progress.md found -- starting fresh session."
    echo ""
fi

# Step 2: Check git context
echo "[INIT] Git context:"
echo "  Branch: $(git branch --show-current 2>/dev/null || echo 'not a git repo')"
echo "  Recent commits:"
git log --oneline -5 2>/dev/null || echo "  (no git history)"
echo ""

# Step 3: Check for uncommitted changes
if git diff --quiet 2>/dev/null && git diff --cached --quiet 2>/dev/null; then
    echo "[INIT] Working tree: clean"
else
    echo "[INIT] Working tree: DIRTY -- uncommitted changes detected"
    git status --short 2>/dev/null
fi
echo ""

# Step 4: Type check
echo "[INIT] TypeScript type check..."
if $TYPE_CMD 2>&1 | tail -5; then
    echo "[INIT] Type check: PASS"
else
    echo "[INIT] Type check: FAIL -- resolve type errors before starting new work"
fi
echo ""

# Step 5: Tests
echo "[INIT] Running tests..."
if $TEST_CMD 2>&1 | tail -10; then
    echo "[INIT] Tests: PASS"
else
    echo "[INIT] Tests: FAIL -- fix failing tests before starting new work"
fi
echo ""

# Step 6: Feature list
if [ -f "feature_list.json" ]; then
    echo "[INIT] Feature list found. In-progress features:"
    grep -o '"[^"]*": "in-progress"' feature_list.json || echo "  (none in progress)"
    echo ""
else
    echo "[INIT] No feature_list.json found -- run harness setup or create it."
    echo ""
fi

# Step 7: Summary
echo "========================================"
echo " Session Ready: $PROJECT_NAME"
echo "========================================"
echo ""
echo "Next: Read CLAUDE.md and .agent/DNA/PROJECT_DNA.md for orientation."
echo "Run /bootstrap-context for full agent context loading."
