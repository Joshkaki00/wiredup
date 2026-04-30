---
name: review
description: Code review checklist for pull requests
disable-model-invocation: true
---

# PR Review Checklist

Review the current diffs against these criteria:

1. **Tests First**: All new features have corresponding tests. Run `npm test` — do they pass?
2. **Context7 Evidence**: Any new library APIs? Capture the live doc query in `evidence/live-docs-usage.md`.
3. **No Hallucinations**: If using an external API, verify with live docs. Compare against `evidence/hallucination-comparison.md` patterns.
4. **Code Style**: Follows `src/` patterns. ES modules, destructuring, async/await.
5. **Linting**: Run `npm run lint` if configured.
6. **Commits**: Each milestone (V1.0, V1.1, V1.2) has a descriptive commit message.

Report findings in the diff view. Ask for revisions if tests fail or evidence is missing.
