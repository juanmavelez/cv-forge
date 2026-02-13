package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/cv-forge/cv-forge/internal/export"
	"github.com/cv-forge/cv-forge/internal/models"
	"github.com/go-chi/chi/v5"
)

// --- Export handlers ---

func (h *handler) exportPDF(w http.ResponseWriter, r *http.Request) {
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

	pdfBytes, err := export.GeneratePDF(cv)
	if err != nil {
		writeError(w, http.StatusInternalServerError, fmt.Sprintf("failed to generate PDF: %v", err))
		return
	}

	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s.pdf"`, cv.Title))
	w.Write(pdfBytes)
}

func (h *handler) exportDOCX(w http.ResponseWriter, r *http.Request) {
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

	docxBytes, err := export.GenerateDOCX(cv)
	if err != nil {
		writeError(w, http.StatusInternalServerError, fmt.Sprintf("failed to generate DOCX: %v", err))
		return
	}

	w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s.docx"`, cv.Title))
	w.Write(docxBytes)
}

func (h *handler) exportJSON(w http.ResponseWriter, r *http.Request) {
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
	var cvExport models.CVExport
	if err := json.NewDecoder(r.Body).Decode(&cvExport); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON format")
		return
	}

	if cvExport.Title == "" {
		cvExport.Title = "Imported CV"
	}

	cv, err := h.db.CreateCV(cvExport.Title, cvExport.Data)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to import CV")
		return
	}

	// Re-import versions if present
	for _, v := range cvExport.Versions {
		_, err := h.db.CreateVersionFromData(cv.ID, v.Message, v.Data)
		if err != nil {
			// Log but continue
			continue
		}
	}

	writeJSON(w, http.StatusCreated, cv)
}
