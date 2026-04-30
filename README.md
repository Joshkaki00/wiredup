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

- [ ] **V1.0** — Configuration & Live Docs
- [ ] **V1.1** — Second Integration (Playwright)
- [ ] **V1.2** — Hallucination Comparison & Polish

## Getting Started

```bash
# Install dependencies
npm install

# Verify MCP servers are connected (in Claude Code)
# Run: /mcp

# Run tests
npm test
```

## What's Next

_To be filled in after completing V1.2._
