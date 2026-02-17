package db

import (
	"database/sql"
	"time"

	"github.com/cv-forge/cv-forge/internal/models"
	"github.com/google/uuid"
)

// ListApplications listing for dashboard.
func (db *DB) ListApplications() ([]models.Application, error) {
	query := `
		SELECT id, company, role, status, salary, url, date, notes, cv_id, cv_version_id, created_at, updated_at
		FROM applications
		ORDER BY date DESC
	`
	rows, err := db.conn.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var apps []models.Application
	for rows.Next() {
		app, err := scanApplication(rows)
		if err != nil {
			return nil, err
		}
		apps = append(apps, app)
	}
	if apps == nil {
		apps = []models.Application{}
	}
	return apps, rows.Err()
}

// GetApplication by ID.
func (db *DB) GetApplication(id string) (*models.Application, error) {
	query := `
		SELECT id, company, role, status, salary, url, date, notes, cv_id, cv_version_id, created_at, updated_at
		FROM applications
		WHERE id = ?
	`
	row := db.conn.QueryRow(query, id)
	app, err := scanApplicationRow(row)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &app, nil
}

// CreateApplication creates a new tracker entry.
func (db *DB) CreateApplication(req models.CreateApplicationRequest) (*models.Application, error) {
	id := uuid.New().String()
	now := time.Now().UTC()

	// Handle cv_id and cv_version_id which can be null (pointer in struct, but string in DB Exec)
	// Actually, sql.NullString is safer, or just pass the pointer directly if driver supports it?
	// modernc.org/sqlite supports passing *string as nil.

	_, err := db.conn.Exec(
		`INSERT INTO applications (id, company, role, status, salary, url, date, notes, cv_id, cv_version_id, created_at, updated_at) 
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		id, req.Company, req.Role, req.Status, req.Salary, req.URL, req.Date, req.Notes, req.CVID, req.CVVersionID, now, now,
	)
	if err != nil {
		return nil, err
	}

	return &models.Application{
		ID:          id,
		Company:     req.Company,
		Role:        req.Role,
		Status:      req.Status,
		Salary:      req.Salary,
		URL:         req.URL,
		Date:        req.Date,
		Notes:       req.Notes,
		CVID:        req.CVID,
		CVVersionID: req.CVVersionID,
		CreatedAt:   now,
		UpdatedAt:   now,
	}, nil
}

// UpdateApplication updates an existing entry.
func (db *DB) UpdateApplication(id string, req models.UpdateApplicationRequest) (*models.Application, error) {
	now := time.Now().UTC()
	res, err := db.conn.Exec(
		`UPDATE applications 
		 SET company=?, role=?, status=?, salary=?, url=?, date=?, notes=?, cv_id=?, cv_version_id=?, updated_at=?
		 WHERE id=?`,
		req.Company, req.Role, req.Status, req.Salary, req.URL, req.Date, req.Notes, req.CVID, req.CVVersionID, now, id,
	)
	if err != nil {
		return nil, err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return nil, nil
	}
	return db.GetApplication(id)
}

// DeleteApplication removes an entry.
func (db *DB) DeleteApplication(id string) (bool, error) {
	res, err := db.conn.Exec(`DELETE FROM applications WHERE id = ?`, id)
	if err != nil {
		return false, err
	}
	n, _ := res.RowsAffected()
	return n > 0, nil
}

// --- Scanners ---

func scanApplication(s interface{ Scan(...any) error }) (models.Application, error) {
	var app models.Application
	var dateStr, createdAt, updatedAt string

	// Pointers for nullable fields
	var cvID, cvVersionID *string

	err := s.Scan(
		&app.ID, &app.Company, &app.Role, &app.Status, &app.Salary, &app.URL,
		&dateStr, &app.Notes, &cvID, &cvVersionID, &createdAt, &updatedAt,
	)
	if err != nil {
		return app, err
	}

	app.CVID = cvID
	app.CVVersionID = cvVersionID

	app.Date, _ = parseTime(dateStr)
	app.CreatedAt, _ = parseTime(createdAt)
	app.UpdatedAt, _ = parseTime(updatedAt)

	return app, nil
}

func scanApplicationRow(row *sql.Row) (models.Application, error) {
	var app models.Application
	var dateStr, createdAt, updatedAt string
	var cvID, cvVersionID *string

	err := row.Scan(
		&app.ID, &app.Company, &app.Role, &app.Status, &app.Salary, &app.URL,
		&dateStr, &app.Notes, &cvID, &cvVersionID, &createdAt, &updatedAt,
	)
	if err != nil {
		return app, err
	}

	app.CVID = cvID
	app.CVVersionID = cvVersionID

	app.Date, _ = parseTime(dateStr)
	app.CreatedAt, _ = parseTime(createdAt)
	app.UpdatedAt, _ = parseTime(updatedAt)

	return app, nil
}

func parseTime(s string) (time.Time, error) {
	t, err := time.Parse("2006-01-02 15:04:05+00:00", s)
	if err != nil {
		return time.Parse("2006-01-02T15:04:05Z", s)
	}
	return t, nil
}
