# Developer Guide

This document is intended for developers and AI agents working on the CV Forge project. It provides high-density context on the architecture, stack, and patterns used.

## Tech Stack
-   **Backend:** Go (1.21+), `chi` router, `sqlite` (modernc.org/sqlite - CGO-free).
-   **Frontend:** React (Vite), TypeScript, SCSS (Modules & Global), `react-router-dom`.
-   **Build:** `Makefile` automates build, test, and dev tasks.

## Project Structure
```
.
├── cmd/cv-forge/       # Application entry point (main.go)
├── internal/
│   ├── api/            # API handlers and router
│   ├── db/             # Database access layer (SQLite)
│   ├── models/         # Go struct definitions (aligned with DB/Front)
│   └── ...
├── web/
│   ├── src/
│   │   ├── api/        # Modular API clients (index.ts, cv.ts, applications.ts)
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route-level components (Dashboard/, History/, JobTracker/)
│   │   ├── styles/     # Global SCSS (variables, mixins, reset)
│   │   └── types.ts    # Shared TypeScript interfaces
│   └── index.html      # Entry HTML
└── Makefile            # Task runner
```

## Key Patterns
1.  **Database Migrations:** located in `internal/db/db.go`. Schema is defined in raw SQL strings within the `migrate()` function.
2.  **API Structure:** RESTful JSON API. Handlers in `internal/api/` use `writeJSON` helper.
3.  **Frontend State:** Local state (useState) for forms; data fetching via `useEffect` calling strict-typed `api/` clients.
4.  **Styling:** SCSS variables in `src/styles/main.scss` control the design system (fonts, colors, spacing). Utility classes like `.form-grid` handling common layouts.

## Common Tasks
-   **Run Dev Server:** `make dev` (starts backend on :8080 and frontend proxy).
-   **Run Tests:** `make test`.
-   **Add Migration:** Edit `internal/db/db.go` and add a new SQL string to the `migrations` slice.
-   **Add Route:** Register in `internal/api/router.go` and add handler in `internal/api/`.

## Context Links
-   **Database Schema:** See `schema.sql` for current table definitions.
-   **API Types:** See `web/src/types.ts` for frontend data contracts.
