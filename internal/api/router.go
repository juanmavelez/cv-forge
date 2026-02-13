package api

import (
	"encoding/json"
	"net/http"

	"github.com/cv-forge/cv-forge/internal/db"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

// NewRouter creates and configures the Chi router with all API routes.
func NewRouter(database *db.DB, staticFS http.FileSystem) *chi.Mux {
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Compress(5))

	h := &handler{db: database}

	// API routes
	r.Route("/api", func(r chi.Router) {
		r.Use(jsonMiddleware)

		// CV CRUD
		r.Get("/cvs", h.listCVs)
		r.Post("/cvs", h.createCV)
		r.Post("/cvs/import", h.importCV)

		r.Route("/cvs/{id}", func(r chi.Router) {
			r.Get("/", h.getCV)
			r.Put("/", h.updateCV)
			r.Delete("/", h.deleteCV)

			// Export
			r.Get("/export/pdf", h.exportPDF)
			r.Get("/export/docx", h.exportDOCX)
			r.Get("/export/json", h.exportJSON)

			// Versions
			r.Get("/versions", h.listVersions)
			r.Post("/versions", h.createVersion)
			r.Get("/versions/{vid}", h.getVersion)
			r.Post("/versions/{vid}/restore", h.restoreVersion)
		})
	})

	// Static files (frontend)
	fileServer := http.FileServer(staticFS)
	r.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		// Try to serve the file; if not found, serve index.html for SPA routing
		fileServer.ServeHTTP(w, r)
	})

	return r
}

func jsonMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}
