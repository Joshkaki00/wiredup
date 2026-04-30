# Wiredup — Claude Instructions

## Core Workflow
- **Tests first**: Write failing tests before any implementation. Agents excel at making tests pass.
- **MCP servers**: Context7 (always query live docs, never trust training data on APIs) · Playwright (browser automation + visual verification)
- **Run tests**: `npm test` after each change. Fix failures before proceeding.

## Code Style
See patterns in `src/` (follow existing conventions). Prefer ES modules, destructuring, async/await.

## Evidence & V1.0–V1.2
- V1.0: Capture Context7 queries in `evidence/live-docs-usage.md`
- V1.2: Side-by-side hallucination comparison in `evidence/hallucination-comparison.md`
- Commit at each milestone with descriptive messages

## Project Defaults
- Language: JavaScript/TypeScript
- Test runner: See `package.json` scripts
- Build: See `package.json` scripts
