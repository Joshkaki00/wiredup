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

**Summary:** Without live docs, would have guessed `data.current.temp` or `data.temperature`; live docs provided exact field naming convention (underscore prefix indicating 2-meter measurement height) and confirmed Celsius default, enabling correct implementation on first try.
