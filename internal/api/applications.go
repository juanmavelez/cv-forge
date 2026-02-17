package api

import (
	"encoding/json"
	"net/http"

	"github.com/cv-forge/cv-forge/internal/models"
	"github.com/go-chi/chi/v5"
)

func (h *handler) listApplications(w http.ResponseWriter, r *http.Request) {
	apps, err := h.db.ListApplications()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list applications")
		return
	}
	writeJSON(w, http.StatusOK, apps)
}

func (h *handler) getApplication(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	app, err := h.db.GetApplication(id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get application")
		return
	}
	if app == nil {
		writeError(w, http.StatusNotFound, "application not found")
		return
	}
	writeJSON(w, http.StatusOK, app)
}

func (h *handler) createApplication(w http.ResponseWriter, r *http.Request) {
	var req models.CreateApplicationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	// Basic validation
	if req.Company == "" || req.Role == "" || req.Status == "" {
		writeError(w, http.StatusBadRequest, "company, role, and status are required")
		return
	}

	app, err := h.db.CreateApplication(req)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create application")
		return
	}
	writeJSON(w, http.StatusCreated, app)
}

func (h *handler) updateApplication(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var req models.UpdateApplicationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	app, err := h.db.UpdateApplication(id, req)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to update application")
		return
	}
	if app == nil {
		writeError(w, http.StatusNotFound, "application not found")
		return
	}
	writeJSON(w, http.StatusOK, app)
}

func (h *handler) deleteApplication(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	ok, err := h.db.DeleteApplication(id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete application")
		return
	}
	if !ok {
		writeError(w, http.StatusNotFound, "application not found")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}
