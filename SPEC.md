# Wiredup — Project Specification

## Purpose

Build a JavaScript application that demonstrates the measurable difference between AI-assisted development with and without live MCP data sources. The deliverable is both working code and documented evidence: a side-by-side record showing how live docs (Context7) and browser automation (Playwright) change output quality.

---

## Scope

The application will expose a small web service that:

1. Fetches and transforms data from a public third-party API
2. Serves the result via a simple HTTP endpoint
3. Has a minimal UI that can be verified visually by Playwright

This gives concrete, testable surface area for both MCP servers: Context7 resolves live library docs while building it, Playwright verifies the running UI.

---

## Quality Gates

Each gate has an invoke command and a binary pass/fail criterion.

### Gate 1 — Tests Pass

**Invoke:**
```bash
npm test
```

**Success criteria:**
- Exit code is `0`
- Every test file in `tests/` has at least one passing assertion
- No tests are skipped or pending without a recorded reason

**Failure criteria:**
- Any test exits with a non-zero code
- A `src/` file was modified without a corresponding test change

---

### Gate 2 — Context7 Evidence Present

**Invoke:**
```bash
# Manually review before each milestone commit
cat evidence/live-docs-usage.md | grep "### "
```

**Success criteria:**
- `evidence/live-docs-usage.md` contains at least **2 dated entries**
- Each entry includes: the library queried, the tool call used (`resolve-library-id` or `query-docs`), a snippet from the live doc response, and a note on how it changed the code
- At least one entry was created during V1.0 development

**Failure criteria:**
- File is empty or contains only the template
- Entries describe what *would* have been queried rather than what *was* queried

---

### Gate 3 — Hallucination Comparison Documented

**Invoke:**
```bash
cat evidence/hallucination-comparison.md | grep "#### Without\|#### With"
```

**Success criteria:**
- `evidence/hallucination-comparison.md` contains at least **1 completed comparison**
- The "Without" section includes a real code sample from Claude without live docs, annotated with the specific error or outdated API it used
- The "With" section includes the corrected version using Context7 output
- The two versions differ in a meaningful way (wrong method name, deprecated argument, missing parameter, etc.)

**Failure criteria:**
- Both sections are identical or nearly identical
- The "Without" section was generated after looking at live docs (comparison is staged)

---

### Gate 4 — Playwright Verification Runs

**Invoke:**
```bash
npm test -- --grep "playwright"
# or if tests are in separate file:
node --test tests/ui.test.js
```

**Success criteria:**
- Playwright launches a browser, navigates to the running app, and makes at least one assertion on the DOM
- The test fails if the UI is broken (e.g., endpoint returns 500, expected element is missing)
- The test passes against the final implementation

**Failure criteria:**
- Playwright is configured but never invoked in any test
- The only assertion is that the page loaded (status 200); no content is verified

---

### Gate 5 — Commit History Reflects Milestones

**Invoke:**
```bash
git log --oneline
```

**Success criteria:**
- At least 3 commits exist, each referencing a milestone: `V1.0`, `V1.1`, `V1.2`
- Each milestone commit is atomic: it does not include unrelated changes
- The `main` branch is not committed to directly after initial setup (work is done on feature branches, or commits are squashed cleanly)

**Failure criteria:**
- All work is in a single commit
- Commit messages are generic (`"updates"`, `"fix"`, `"final"`)

---

## Acceptance Criteria

### AC-1 — Context7 Is Invoked Automatically

**Given** the `CLAUDE.md` rule requiring Context7 for any library API question,  
**When** I ask Claude to implement an HTTP endpoint using a specific npm package (e.g., `express`, `hono`, `fastify`),  
**Then** Claude calls `resolve-library-id` and `query-docs` before writing the implementation — without me having to type "use context7".

---

### AC-2 — Live Docs Prevent a Hallucinated API

**Given** a library where the API changed between the version in Claude's training data and the current version,  
**When** Claude queries Context7 for the current API,  
**Then** the code it writes uses the correct, current method signatures — and the evidence file records both the old (hallucinated) form and the corrected form side by side.

---

### AC-3 — Playwright Catches a UI Regression

**Given** a working endpoint that returns JSON rendered in the UI,  
**When** I intentionally break the endpoint (e.g., change the response key),  
**Then** the Playwright test fails with a descriptive assertion error — before any manual review is needed.

---

### AC-4 — Tests Were Written Before Implementation

**Given** the test-first rule in `CLAUDE.md`,  
**When** I review `git log --diff-filter=A -- tests/` against `git log --diff-filter=A -- src/`,  
**Then** every `tests/*.test.js` file that covers a `src/` module has an earlier or same-commit creation timestamp — implementation never precedes its test.

---

### AC-5 — The App Serves a Real Third-Party API Response

**Given** the application is running locally (`npm run dev`),  
**When** I `curl http://localhost:3000/data` (or equivalent endpoint),  
**Then** the response contains live data fetched from the third-party API — not a hardcoded fixture — and the response time is under 3 seconds on a normal connection.

---

### AC-6 — Evidence Files Are Human-Readable Narratives

**Given** the two evidence files in `evidence/`,  
**When** a reader who was not present during development reads them,  
**Then** they can understand: which library was queried, what the AI got wrong without live docs, what the correct version looked like with live docs, and why the difference matters.

---

## Out of Scope

- Authentication or user accounts
- Production deployment
- More than one third-party data source (keep scope narrow to keep evidence clean)
- A build/bundle step (plain Node.js is sufficient)

---

## Open Questions

- [ ] Which third-party API will be used for the data source? (Public, no auth preferred — e.g., Open Meteo weather, JSONPlaceholder, GitHub public API)
- [ ] Which HTTP library? (Affects Context7 evidence — pick something where training data is likely stale)
- [ ] Will the UI be a served HTML page or a separate frontend framework?
