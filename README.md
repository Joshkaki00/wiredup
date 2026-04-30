# Wiredup

> Connect your dev tools to the outside world — live docs, browsers, databases, and anything else you can think of!

## Overview

This project demonstrates integrating live data sources into an AI-assisted development workflow using the [Model Context Protocol (MCP)](https://modelcontextprotocol.io). By connecting Claude Code to real-time documentation and browser automation, we can measure the difference between AI hallucinations and grounded, accurate output.

## MCP Servers Configured

| Server | Package | Purpose |
|--------|---------|---------|
| **Context7** | `@upstash/context7-mcp` | Live, version-specific library documentation |
| **Playwright** | `@playwright/mcp` | Browser automation and visual UI verification |

## Project Structure

```
wiredup/
├── README.md
├── CLAUDE.md
├── .mcp.json
├── evidence/
│   ├── live-docs-usage.md        # Context7 query evidence
│   └── hallucination-comparison.md  # With vs. without live docs
├── src/
│   └── (application code)
└── tests/
    └── (test suite)
```

## Progress

- [x] **V1.0** — Configuration & Live Docs
- [x] **V1.1** — Server Fix & Playwright Visual Verification
- [x] **V1.2** — Hallucination Comparison Evidence & Polish

## Getting Started

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run unit tests (Node.js built-in test runner)
npm test

# Run Playwright visual tests
npm run test:playwright

# Start the dev server
npm run dev
```

## What's Next

### MCP Servers in Action

**Context7 (Live Documentation)**  
Context7 queries provided live, version-specific API documentation before writing code. Queried:
- **Hono routing** — confirmed context object `c` with `c.json()` method (not Express-style `req/res`)
- **Open Meteo API** — revealed exact response schema with `temperature_2m` field under `current` object

Without live docs, hallucinations would have included wrong field names (`data.temperature`, `data.current_temperature`) and incorrect handler patterns. Live docs enabled correct implementation on first attempt.

**Playwright (Browser Automation)**  
Playwright tests (`test:playwright`) spin up the dev server and verify:
- Page title and DOM elements render correctly
- API endpoints return valid JSON shapes
- Catches UI regressions if the `/data` endpoint breaks

### Evidence Files

- `evidence/live-docs-usage.md` — Documents 3 Context7 queries and their impact (Hono patterns, Open Meteo schema)
- `evidence/hallucination-comparison.md` — Side-by-side comparison showing what Claude would guess from training data vs. what live docs revealed

### Future Improvements

- Add more weather variables (wind speed, humidity, weather code)
- Integrate additional MCP servers (e.g., GitHub API, database access)
- Build a frontend dashboard to visualize real-time weather data
- Document performance gains from live docs across different library APIs
