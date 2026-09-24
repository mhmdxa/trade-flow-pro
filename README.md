# TradeFlow

TradeFlow is a trading-management application for organizing accounts, strategies, trades, journals, analytics, risk settings, reports, and calendar events in one place.

## What is inside?

- **Accounts** — trading account information.
- **Trades** — entry, exit, stop loss, take profit, P/L and notes.
- **Strategies** — strategy name, timeframe, indicators, entry rules and exit rules.
- **Journal** — trading notes, emotions and mistakes.
- **Analytics** — win rate, profit factor and trade counts.
- **Risk settings** — initial balance, daily loss limit and maximum drawdown limit.
- **Reports** — saved reports and report links.
- **Calendar events** — market/event reminders and impact information.
- **Frontend** — Angular application.
- **Database** — SQLite database file used by the project.

## Technology

- Angular 18
- TypeScript
- RxJS
- Chart.js
- Tailwind CSS
- SQLite
- jsPDF
- XLSX export

## Run the project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Database

The repository contains `tradeflow.db`, a SQLite database.

The database currently contains tables for users, trades, strategies, journals, analytics, risk settings, reports, calendar events, and application settings.

**Important:** do not upload real passwords, API keys, JWT secrets, or other private credentials to GitHub.

## Project goal

The goal of TradeFlow is to turn trading activity into an organized, measurable workflow instead of scattered notes and random records.

## Development roadmap

1. Document the current architecture.
2. Verify the database schema and application data flow.
3. Review authentication and password handling.
4. Separate frontend configuration from backend secrets.
5. Add clear validation and error handling.
6. Add tests for critical trading and risk calculations.
7. Improve documentation and screenshots.
8. Prepare a clean portfolio/demo version.

## Repository structure

The main application is in this repository. Experimental/duplicate repositories are being kept separate until they are reviewed and removed manually from GitHub.

---

**Status:** Active development
