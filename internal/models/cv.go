package models

import "time"

// PersonalInfo holds the user's contact and personal details.
type PersonalInfo struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Title     string `json:"title"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Location  string `json:"location"`
	LinkedIn  string `json:"linkedin"`
	Website   string `json:"website"`
}

// Experience represents a single work experience entry.
type Experience struct {
	Company     string `json:"company"`
	Title       string `json:"title"`
	Location    string `json:"location"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
	Current     bool   `json:"current"`
	Description string `json:"description"`
}

// Education represents a single education entry.
type Education struct {
	Institution string `json:"institution"`
	Degree      string `json:"degree"`
	Field       string `json:"field"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
	Description string `json:"description"`
}

// SkillGroup represents a category of skills.
type SkillGroup struct {
	Category string   `json:"category"`
	Items    []string `json:"items"`
}

// Language represents a language and proficiency level.
type Language struct {
	Language    string `json:"language"`
	Proficiency string `json:"proficiency"`
}

// Certification represents a professional certification.
type Certification struct {
	Name   string `json:"name"`
	Issuer string `json:"issuer"`
	Date   string `json:"date"`
	URL    string `json:"url"`
}

// FontStyle defines the appearance of a text element.
type FontStyle struct {
	Size   float64 `json:"size"`
	Color  []int   `json:"color"`
	Bold   bool    `json:"bold"`
	Italic bool    `json:"italic"`
}

// StyleConfig holds all the style definitions for a CV.
type StyleConfig struct {
	Title1 FontStyle `json:"title1"`
	Title2 FontStyle `json:"title2"`
	Text1  FontStyle `json:"text1"`
	Text2  FontStyle `json:"text2"`
	Sub    FontStyle `json:"sub"`
}

// SectionLabels defines customizable text for headings and static strings.
type SectionLabels struct {
	Summary        string `json:"summary"`
	Experience     string `json:"experience"`
	Education      string `json:"education"`
	Skills         string `json:"skills"`
	Languages      string `json:"languages"`
	Certifications string `json:"certifications"`
	Present        string `json:"present"`
}

// CVData holds all the structured content of a CV.
type CVData struct {
	Personal       PersonalInfo    `json:"personal"`
	Summary        string          `json:"summary"`
	Experience     []Experience    `json:"experience"`
	Education      []Education     `json:"education"`
	Skills         []SkillGroup    `json:"skills"`
	Languages      []Language      `json:"languages"`
	Certifications []Certification `json:"certifications"`
	Style          *StyleConfig    `json:"style,omitempty"`
	Labels         *SectionLabels  `json:"labels,omitempty"`
}

// CV represents a complete CV with metadata.
type CV struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Data      CVData    `json:"data"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// CVVersion represents a snapshot of a CV at a point in time.
type CVVersion struct {
	ID        string    `json:"id"`
	CVID      string    `json:"cvId"`
	Data      CVData    `json:"data"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"createdAt"`
}

// CreateCVRequest is the request body for creating a new CV.
type CreateCVRequest struct {
	Title string `json:"title"`
	Data  CVData `json:"data"`
}

// UpdateCVRequest is the request body for updating a CV.
type UpdateCVRequest struct {
	Title string `json:"title"`
	Data  CVData `json:"data"`
}

// CreateVersionRequest is the request body for creating a version snapshot.
type CreateVersionRequest struct {
	Message string `json:"message"`
}

// CVExport is the JSON export format for a CV.
type CVExport struct {
	Title      string      `json:"title"`
	Data       CVData      `json:"data"`
	ExportedAt time.Time   `json:"exportedAt"`
	Versions   []CVVersion `json:"versions,omitempty"`
}
