package models

import "time"

// ApplicationStatus represents the status of a job application.
type ApplicationStatus string

const (
	StatusApplied      ApplicationStatus = "Applied"
	StatusInterviewing ApplicationStatus = "Interviewing"
	StatusRejected     ApplicationStatus = "Rejected"
	StatusOffer        ApplicationStatus = "Offer"
)

// Application represents a job application.
type Application struct {
	ID          string            `json:"id"`
	Company     string            `json:"company"`
	Role        string            `json:"role"`
	Status      ApplicationStatus `json:"status"`
	Salary      string            `json:"salary"`
	URL         string            `json:"url"`
	Date        time.Time         `json:"date"`
	Notes       string            `json:"notes"`
	CVID        *string           `json:"cvId"`        // Nullable
	CVVersionID *string           `json:"cvVersionId"` // Nullable
	CreatedAt   time.Time         `json:"createdAt"`
	UpdatedAt   time.Time         `json:"updatedAt"`
}

// CreateApplicationRequest is the payload for creating an application.
type CreateApplicationRequest struct {
	Company     string            `json:"company"`
	Role        string            `json:"role"`
	Status      ApplicationStatus `json:"status"`
	Salary      string            `json:"salary"`
	URL         string            `json:"url"`
	Date        time.Time         `json:"date"`
	Notes       string            `json:"notes"`
	CVID        *string           `json:"cvId"`
	CVVersionID *string           `json:"cvVersionId"`
}

// UpdateApplicationRequest is the payload for updating an application.
type UpdateApplicationRequest struct {
	Company     string            `json:"company"`
	Role        string            `json:"role"`
	Status      ApplicationStatus `json:"status"`
	Salary      string            `json:"salary"`
	URL         string            `json:"url"`
	Date        time.Time         `json:"date"`
	Notes       string            `json:"notes"`
	CVID        *string           `json:"cvId"`
	CVVersionID *string           `json:"cvVersionId"`
}
