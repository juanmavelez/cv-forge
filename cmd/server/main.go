package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/cv-forge/cv-forge/internal/api"
	"github.com/cv-forge/cv-forge/internal/db"
	"github.com/joho/godotenv"
)

//go:embed all:dist
var distFS embed.FS

func main() {
	// Load .env file if it exists
	_ = godotenv.Load()

	port := flag.Int("port", 8080, "port to listen on")
	dbPath := flag.String("db", "", "path to SQLite database file (default: ~/.cv-forge/data.db)")
	flag.Parse()

	// Initialize Auth
	api.InitAuth()

	// Determine database path
	if *dbPath == "" {
		home, err := os.UserHomeDir()
		if err != nil {
			log.Fatalf("failed to get home dir: %v", err)
		}
		dir := filepath.Join(home, ".cv-forge")
		if err := os.MkdirAll(dir, 0755); err != nil {
			log.Fatalf("failed to create data dir: %v", err)
		}
		*dbPath = filepath.Join(dir, "data.db")
	}

	// Open database
	database, err := db.New(*dbPath)
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer database.Close()

	// Setup static file serving from embedded FS
	distContent, err := fs.Sub(distFS, "dist")
	if err != nil {
		log.Fatalf("failed to access embedded files: %v", err)
	}
	staticFS := http.FS(distContent)

	// Create router and start server
	router := api.NewRouter(database, staticFS)

	addr := fmt.Sprintf(":%d", *port)
	log.Printf("CV Forge starting on http://localhost%s", addr)
	log.Printf("Database: %s", *dbPath)

	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
