# Hallucination Comparison

This file documents side-by-side comparisons of AI output **with** vs. **without** live documentation for the same API call.

## Format

For each comparison:
1. Pick a specific library API or method
2. Ask Claude to use it **without** Context7 (or note what it produces from training data)
3. Ask Claude to use it **with** Context7 live docs
4. Record both outputs and note the differences

---

## Comparison Entries

_Add entries here as you experiment. Example format:_

### [Date] — [Library] `[method/API]`

**Library & Version:** _e.g., Playwright 1.52_

**Task:** _What you asked Claude to implement_

---

#### Without Live Docs (Training Data Only)

```js
// Claude's output without Context7
```

**Issues / Hallucinations:**
- _List any incorrect APIs, deprecated methods, wrong signatures, etc._

---

#### With Live Docs (Context7)

```js
// Claude's output with Context7 live docs
```

**Accuracy:**
- _Note what was correct, updated, or different from the hallucinated version_

---

**Summary:** _One sentence on what changed and why it matters_
