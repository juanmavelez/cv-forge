package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/cv-forge/cv-forge/internal/models"
	"github.com/go-chi/chi/v5"
)

// --- Export handlers ---

func (h *handler) exportJSON(w http.ResponseWriter, r *http.Request) {
	userID, ok := GetUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	id := chi.URLParam(r, "id")
	cv, err := h.db.GetCV(id, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get CV")
		return
	}
	if cv == nil {
		writeError(w, http.StatusNotFound, "CV not found")
		return
	}

	versions, err := h.db.ListVersions(id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list versions")
		return
	}

	cvExport := models.CVExport{
		Title:      cv.Title,
		Data:       cv.Data,
		ExportedAt: time.Now().UTC(),
		Versions:   versions,
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s.json"`, cv.Title))
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	enc.Encode(cvExport)
}

func (h *handler) importCV(w http.ResponseWriter, r *http.Request) {
	userID, ok := GetUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var cvExport models.CVExport
	if err := json.NewDecoder(r.Body).Decode(&cvExport); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON format")
		return
	}

	if cvExport.Title == "" {
		cvExport.Title = "Imported CV"
	}

	cv, err := h.db.CreateCV(userID, cvExport.Title, cvExport.Data)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to import CV")
		return
	}

	// Re-import versions if present
	for _, v := range cvExport.Versions {
		// Verify ownership check might be implicitly handled if CreateCV succeeded
		// But CreateVersionFromData doesn't take userID, it trusts caller?
		// db.CreateVersionFromData(cvID, message, data).
		// Since we just created cv and got cv.ID, we are owner.
		_, err := h.db.CreateVersionFromData(cv.ID, v.Message, v.Data)
		if err != nil {
			// Log but continue
			continue
		}
	}

	writeJSON(w, http.StatusCreated, cv)
}
