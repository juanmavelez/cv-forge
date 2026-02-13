package api

import (
	"encoding/json"
	"net/http"

	"github.com/cv-forge/cv-forge/internal/db"
	"github.com/cv-forge/cv-forge/internal/models"
	"github.com/go-chi/chi/v5"
)

type handler struct {
	db *db.DB
}

// --- CV CRUD ---

func (h *handler) listCVs(w http.ResponseWriter, r *http.Request) {
	cvs, err := h.db.ListCVs()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list CVs")
		return
	}
	writeJSON(w, http.StatusOK, cvs)
}

func (h *handler) getCV(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	cv, err := h.db.GetCV(id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get CV")
		return
	}
	if cv == nil {
		writeError(w, http.StatusNotFound, "CV not found")
		return
	}
	writeJSON(w, http.StatusOK, cv)
}

func (h *handler) createCV(w http.ResponseWriter, r *http.Request) {
	var req models.CreateCVRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Title == "" {
		req.Title = "Untitled CV"
	}
	cv, err := h.db.CreateCV(req.Title, req.Data)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create CV")
		return
	}
	writeJSON(w, http.StatusCreated, cv)
}

func (h *handler) updateCV(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req models.UpdateCVRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	cv, err := h.db.UpdateCV(id, req.Title, req.Data)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to update CV")
		return
	}
	if cv == nil {
		writeError(w, http.StatusNotFound, "CV not found")
		return
	}
	writeJSON(w, http.StatusOK, cv)
}

func (h *handler) deleteCV(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	ok, err := h.db.DeleteCV(id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete CV")
		return
	}
	if !ok {
		writeError(w, http.StatusNotFound, "CV not found")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}
