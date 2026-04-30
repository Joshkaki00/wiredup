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

### 2026-04-30 — Open Meteo API `current weather parameters`

**Library & Version:** Open Meteo (version-agnostic HTTP API)

**Task:** Parse current weather response from Open Meteo forecast endpoint

---

#### Without Live Docs (Training Data Only)

```js
// Claude would likely guess from training data:
const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
const res = await fetch(url)
const data = await res.json()

// Uncertain about response structure, might try:
const temp = data.current.temp // ❌ likely wrong field name
const temp = data.current_temperature // ❌ wrong structure
const temp = data.temperature // ❌ missing nesting
```

**Issues / Hallucinations:**
- Uncertain whether response field is `temp_2m`, `temperature`, `current_temperature`, or `temperature_2m`
- Might guess wrong nesting level (flat vs. nested under `current` object)
- Unclear if `temperature_unit` parameter exists or what units default to
- No confidence on whether `current` parameter uses comma-separated list or other format

---

#### With Live Docs (Context7)

**Live doc confirms API schema:**

Query parameter: `current=temperature_2m` (not comma-separated list for single field)

Official response structure documented:
```json
{
  "current": {
    "temperature_2m": 18.5,
    "wind_speed_10m": 5.2,
    "weather_code": 0
  }
}
```

```js
// Correct implementation with live docs:
const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
const res = await fetch(url)
const data = await res.json()

// Live docs confirm exact field name and nesting:
const temp = data.current.temperature_2m // ✓ correct, underscore in field name
// Defaults to Celsius by spec; temperature_unit parameter available if Fahrenheit needed
```

**Accuracy:**
- Correct field name `temperature_2m` (underscore, unit-qualified identifier)
- Correct nesting: temperature under `current` object
- Confirmed Celsius as default unit (no guessing)
- Revealed optional parameters like `temperature_unit`, `timezone`, `models`, `wind_speed_unit`

---

**Runtime Impact:**
Without live docs, code execution would fail:
```js
// This would CRASH:
const temp = data.current.temp  
// TypeError: Cannot read property 'temp' of undefined

// This would silently return undefined:
const temp = data.temperature
// No error, but UI would show "undefined°C"
```

With live docs, code works correctly on first try:
```js
const temp = data.current.temperature_2m
// Returns 18.5 (number) — works immediately
```

**Summary:** Live docs revealed exact field naming convention and prevented TypeError at runtime. Without them, developer would spend time debugging why `data.current.temp` is undefined, then guessing alternative field names.

---

### 2026-04-30 — Hono Framework `app.serve()` method

**Library & Version:** Hono v4.12.15 with @hono/node-server

**Task:** Start HTTP server on Node.js

---

#### Without Live Docs (Training Data Only)

```js
// Claude might guess Hono has a .serve() method like Express:
const app = new Hono()
app.get('/', (c) => c.text('Hello'))

// Attempt 1: Wrong — Hono doesn't have app.serve()
app.serve({ port: 3000 })  
// ❌ TypeError: app.serve is not a function

// Attempt 2: Hallucinate Express-like API
app.listen(3000)
// ❌ TypeError: app.listen is not a function

// Attempt 3: Maybe it's like Next.js?
const server = app.start()
// ❌ TypeError: app.start is not a function
```

**Issues / Hallucinations:**
- Confused Hono's API with Express (res.json, app.listen)
- Didn't know you need a separate adapter package (@hono/node-server)
- No awareness that Hono uses `serve()` from the adapter, not a method on the app instance

---

#### With Live Docs (Context7)

Live docs immediately revealed the correct pattern:

```js
import { serve } from '@hono/node-server'  // ← separate adapter required
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello'))

// Correct usage:
serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server running at http://localhost:${info.port}`)
})
```

**Accuracy:**
- Revealed need for separate `@hono/node-server` adapter
- Showed correct `serve()` function signature: accepts config object and callback
- Clarified that you pass `app.fetch`, not the app instance
- Confirmed callback receives `info` object with port info

---

**Runtime Impact:**
Without live docs: immediate runtime error trying to call `app.serve()` or `app.listen()`, forcing developer to search for "hono start server" and discover the adapter through trial and error.

With live docs: server starts correctly on first attempt with proper port logging and startup confirmation.

**Summary:** Live docs prevented a class of "function doesn't exist" errors and revealed the Hono-specific adapter pattern that would not be obvious from the main package alone.

---

### 2026-04-30 — SQLite Query Syntax (Database Dialect Differences)

**Library & Version:** SQLite with better-sqlite3 Node.js binding

**Task:** Query latest weather record per city from history table

---

#### Without Live Docs (Training Data Only)

```sql
-- Claude might try PostgreSQL syntax (common in training data):
SELECT DISTINCT ON (location) location, temperature, unit, recorded_at
FROM weather_history
ORDER BY location, recorded_at DESC
-- ❌ SyntaxError: DISTINCT ON is PostgreSQL-only, not available in SQLite
```

**Issues / Hallucinations:**
- Confused SQLite with PostgreSQL (training data contains extensive PostgreSQL examples)
- DISTINCT ON is PostgreSQL-specific, doesn't exist in SQLite
- No alternative approach without live docs
- Runtime: SQL syntax error, query fails immediately, dashboard cannot load history

---

#### With Live Docs (Context7)

Live docs revealed SQLite's portable subquery pattern for latest-per-group:

```sql
-- Correct SQLite approach (also works in PostgreSQL, MySQL, etc.):
SELECT location, temperature, unit, recorded_at
FROM weather_history
WHERE recorded_at = (
  SELECT MAX(recorded_at)
  FROM weather_history wh2
  WHERE wh2.location = weather_history.location
)
ORDER BY location
-- ✓ Valid SQLite syntax, works on first try
```

**Accuracy:**
- Correct use of subquery with MAX() to get latest per group
- Proper table alias (wh2) for correlation
- Works across all SQL databases (SQLite, PostgreSQL, MySQL, etc.)
- Portable, not dialect-specific

---

**Runtime Impact:**
Without live docs: immediate SQL syntax error when querying history, weather comparison dashboard fails to load data, stats endpoint returns empty.

With live docs: query executes correctly, weather history loads, comparison stats render properly.

**Summary:** Live docs prevented database query errors by revealing the portable subquery pattern instead of the PostgreSQL-specific DISTINCT ON syntax that would have been tried first, highlighting the importance of live context for SQL dialects.
