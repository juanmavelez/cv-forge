package api

import (
	"encoding/json"
	"net/http"

	"github.com/cv-forge/cv-forge/internal/models"
	"github.com/go-chi/chi/v5"
)

// --- Version handlers ---

func (h *handler) listVersions(w http.ResponseWriter, r *http.Request) {
	userID, ok := GetUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	cvID := chi.URLParam(r, "id")

	// Check CV exists and belongs to user
	cv, err := h.db.GetCV(cvID, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get CV")
		return
	}
	if cv == nil {
		writeError(w, http.StatusNotFound, "CV not found")
		return
	}

	versions, err := h.db.ListVersions(cvID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list versions")
		return
	}
	writeJSON(w, http.StatusOK, versions)
}

func (h *handler) getVersion(w http.ResponseWriter, r *http.Request) {
	userID, ok := GetUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	cvID := chi.URLParam(r, "id")
	// Verify ownership
	cv, err := h.db.GetCV(cvID, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get CV")
		return
	}
	if cv == nil {
		writeError(w, http.StatusNotFound, "CV not found")
		return
	}

	versionID := chi.URLParam(r, "vid")
	version, err := h.db.GetVersion(cvID, versionID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get version")
		return
	}
	if version == nil {
		writeError(w, http.StatusNotFound, "version not found")
		return
	}
	writeJSON(w, http.StatusOK, version)
}

func (h *handler) createVersion(w http.ResponseWriter, r *http.Request) {
	userID, ok := GetUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	cvID := chi.URLParam(r, "id")

	var req models.CreateVersionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Message == "" {
		req.Message = "Snapshot"
	}

	// Create version snapshot

	version, err := h.db.CreateVersion(cvID, userID, req.Message)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create version")
		return
	}
	if version == nil {
		writeError(w, http.StatusNotFound, "CV not found")
		return
	}
	writeJSON(w, http.StatusCreated, version)
}

func (h *handler) restoreVersion(w http.ResponseWriter, r *http.Request) {
	userID, ok := GetUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	cvID := chi.URLParam(r, "id")
	versionID := chi.URLParam(r, "vid")

	// Restore version

	cv, err := h.db.RestoreVersion(cvID, versionID, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to restore version")
		return
	}
	if cv == nil {
		writeError(w, http.StatusNotFound, "CV or version not found")
		return
	}
	writeJSON(w, http.StatusOK, cv)
}
