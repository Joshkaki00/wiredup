#!/bin/bash
# Hook: Enforce test-first workflow
# Runs before file edits in src/

set -e

# Check if test file exists for the module being changed
CHANGED_FILE="$1"
TEST_FILE="${CHANGED_FILE//src\//tests\/}.test.js"

# If editing src but no corresponding test exists, warn
if [[ "$CHANGED_FILE" =~ ^src/ ]] && [[ ! -f "$TEST_FILE" ]]; then
  echo "⚠️  No test file found: $TEST_FILE"
  echo "Remember: Tests first! Create failing tests before implementing."
fi
