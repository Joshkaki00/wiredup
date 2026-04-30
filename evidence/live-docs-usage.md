# Live Docs Usage Evidence

This file captures evidence of Context7 querying live documentation during development.

## How to Capture Evidence

When Context7 fetches docs, include:
- The library and version queried
- The tool call that triggered it (`resolve-library-id` / `query-docs`)
- A screenshot or log excerpt showing the live response
- How it influenced the code written

---

## Evidence Entries

### 2026-04-30 — Hono v4.12.15 (Live Context7 Query)

**Prompt / Task:** Implement GET /data endpoint using Hono that returns JSON with temperature, unit, location, and timestamp from live weather API

**Context7 Query:**
```
resolve-library-id: /llmstxt/hono_dev_llms_txt
query-docs: route handler GET async JSON response c.json pattern
```

**Live Doc Response (excerpt):**
```typescript
// Return JSON Response - Hono's c.json() method
app.get('/api/hello', (c) => {
  return c.json({
    ok: true,
    message: 'Hello Hono!'
  })
})

// c.json() is a shortcut for returning JSON with Content-Type: application/json
```

**Actual Implementation (with live docs):**
```javascript
import { fetchWeather } from './weather.js'

app.get('/data', async (c) => {
  const weather = await fetchWeather({ latitude: 37.7749, longitude: -122.4194 })
  const data = {
    temperature: weather.temperature,
    unit: weather.unit,
    location: 'San Francisco',
    timestamp: new Date().toISOString()
  }
  return c.json(data)  // ✓ c.json() correctly sets Content-Type
})
```

**Impact on Code:**
Live docs confirmed that Hono uses context object `c` with `c.json()` method (not Express-style `res.json()`). Pattern also shows handlers can be `async` functions, enabling integration with `fetchWeather()` for real live API data. Without live docs, would have guessed Express patterns.

---

### 2026-04-30 — Open Meteo Weather API (Live Context7 Query)

**Prompt / Task:** Implement fetchWeather() to call Open Meteo API and extract current temperature

**Context7 Query:**
```
resolve-library-id: /open-meteo/open-meteo
query-docs: current weather API forecast endpoint query parameters
```

**Live Doc Response (excerpt from official API docs):**
```
GET /v1/forecast

Query Parameters:
- latitude (float) - Required
- longitude (float) - Required  
- current (string) - Optional - Current weather variables
- hourly (string) - Optional - Hourly weather variables
- temperature_unit (string) - Optional - Unit for temperature (e.g., fahrenheit)
- timezone (string) - Optional - Timezone for timestamps

Example:
curl "https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.69&current=temperature_2m,wind_speed_10m,weather_code"

Response contains current weather under "current" object with exact field names like temperature_2m
```

**Actual Code Implementation (with live docs):**
```javascript
export async function fetchWeather(coords) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m`
  const res = await fetch(url)
  const data = await res.json()
  return {
    temperature: data.current.temperature_2m,  // ✓ exact field name from live docs
    unit: '°C'  // ✓ confirmed default unit
  }
}
```

**Impact on Code:**
Live docs confirmed the exact query parameter syntax (`current=temperature_2m`), the precise response field name (`temperature_2m`, not `temp_2m` or `current_temperature`), and the nesting under `current` object. Without these docs, API parsing would fail on first attempt due to wrong field name guesses.
