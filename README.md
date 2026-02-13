# CV Forge

A self-hosted CV builder. Create, manage, and export professional CVs from a clean web interface.

## Features

- 📝 **Structured CV editing** — Fill in sections like LinkedIn (Personal info, Summary, Experience, Education, Skills, Languages, Certifications)
- 📄 **Multiple CVs** — Create and manage several CVs
- 📸 **Version control** — Git-style snapshots with history and restore
- 📤 **Export** — PDF (clean one-column) and DOCX (editable in Google Docs/Word)
- 💾 **JSON backup** — Import/export your data
- 🌙 **Dark mode** — Light/dark theme with system preference detection
- 🔒 **Self-hosted** — Your data stays on your machine

## Quick Start

```bash
# Clone the repo
git clone https://github.com/cv-forge/cv-forge.git
cd cv-forge

# Build
make build

# Run
./cv-forge
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Requirements

- Go 1.21+
- Node.js 18+

## Options

```
Usage: cv-forge [flags]

Flags:
  -port int     Port to listen on (default 8080)
  -db string    Path to SQLite database file (default ~/.cv-forge/data.db)
```

## Development

```bash
# Run in development mode (auto-reloads frontend)
make dev

# Clean build artifacts
make clean
```

## Tech Stack

- **Backend:** Go, Chi router, SQLite (pure Go driver)
- **Frontend:** TypeScript, vanilla CSS
- **Export:** go-pdf/fpdf (PDF), Open XML (DOCX)
- **Build:** esbuild, Make

## License

MIT
