package db

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/cv-forge/cv-forge/internal/models"
	"github.com/google/uuid"
	_ "modernc.org/sqlite"
)

// DB wraps the SQLite database connection.
type DB struct {
	conn *sql.DB
}

// New opens a SQLite database and runs migrations.
func New(path string) (*DB, error) {
	conn, err := sql.Open("sqlite", path+"?_pragma=foreign_keys(1)&_pragma=journal_mode(wal)")
	if err != nil {
		return nil, fmt.Errorf("open db: %w", err)
	}
	db := &DB{conn: conn}
	if err := db.migrate(); err != nil {
		conn.Close()
		return nil, fmt.Errorf("migrate: %w", err)
	}
	return db, nil
}

// Close closes the database connection.
func (db *DB) Close() error {
	return db.conn.Close()
}

func (db *DB) migrate() error {
	migrations := []string{
		`CREATE TABLE IF NOT EXISTS cvs (
			id TEXT PRIMARY KEY,
			title TEXT NOT NULL,
			data TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS cv_versions (
			id TEXT PRIMARY KEY,
			cv_id TEXT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
			data TEXT NOT NULL,
			message TEXT NOT NULL DEFAULT '',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
	}
	for _, m := range migrations {
		if _, err := db.conn.Exec(m); err != nil {
			return err
		}
	}
	return nil
}

// --- CV CRUD ---

// ListCVs returns all CVs (without full data, for the dashboard).
func (db *DB) ListCVs() ([]models.CV, error) {
	rows, err := db.conn.Query(`SELECT id, title, data, created_at, updated_at FROM cvs ORDER BY updated_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cvs []models.CV
	for rows.Next() {
		cv, err := scanCV(rows)
		if err != nil {
			return nil, err
		}
		cvs = append(cvs, cv)
	}
	if cvs == nil {
		cvs = []models.CV{}
	}
	return cvs, rows.Err()
}

// GetCV returns a single CV by ID.
func (db *DB) GetCV(id string) (*models.CV, error) {
	row := db.conn.QueryRow(`SELECT id, title, data, created_at, updated_at FROM cvs WHERE id = ?`, id)
	cv, err := scanCVRow(row)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &cv, nil
}

// CreateCV creates a new CV and returns it.
func (db *DB) CreateCV(title string, data models.CVData) (*models.CV, error) {
	id := uuid.New().String()
	dataJSON, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	now := time.Now().UTC()
	_, err = db.conn.Exec(
		`INSERT INTO cvs (id, title, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
		id, title, string(dataJSON), now, now,
	)
	if err != nil {
		return nil, err
	}
	return &models.CV{
		ID:        id,
		Title:     title,
		Data:      data,
		CreatedAt: now,
		UpdatedAt: now,
	}, nil
}

// UpdateCV updates an existing CV.
func (db *DB) UpdateCV(id, title string, data models.CVData) (*models.CV, error) {
	dataJSON, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	now := time.Now().UTC()
	res, err := db.conn.Exec(
		`UPDATE cvs SET title = ?, data = ?, updated_at = ? WHERE id = ?`,
		title, string(dataJSON), now, id,
	)
	if err != nil {
		return nil, err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return nil, nil
	}
	return db.GetCV(id)
}

// DeleteCV deletes a CV by ID.
func (db *DB) DeleteCV(id string) (bool, error) {
	res, err := db.conn.Exec(`DELETE FROM cvs WHERE id = ?`, id)
	if err != nil {
		return false, err
	}
	n, _ := res.RowsAffected()
	return n > 0, nil
}

// --- Versions ---

// ListVersions returns all versions for a CV.
func (db *DB) ListVersions(cvID string) ([]models.CVVersion, error) {
	rows, err := db.conn.Query(
		`SELECT id, cv_id, data, message, created_at FROM cv_versions WHERE cv_id = ? ORDER BY created_at DESC`,
		cvID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var versions []models.CVVersion
	for rows.Next() {
		v, err := scanVersion(rows)
		if err != nil {
			return nil, err
		}
		versions = append(versions, v)
	}
	if versions == nil {
		versions = []models.CVVersion{}
	}
	return versions, rows.Err()
}

// GetVersion returns a specific version.
func (db *DB) GetVersion(cvID, versionID string) (*models.CVVersion, error) {
	row := db.conn.QueryRow(
		`SELECT id, cv_id, data, message, created_at FROM cv_versions WHERE id = ? AND cv_id = ?`,
		versionID, cvID,
	)
	v, err := scanVersionRow(row)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &v, nil
}

// CreateVersion creates a new version snapshot of the current CV data.
func (db *DB) CreateVersion(cvID, message string) (*models.CVVersion, error) {
	cv, err := db.GetCV(cvID)
	if err != nil {
		return nil, err
	}
	if cv == nil {
		return nil, nil
	}

	id := uuid.New().String()
	dataJSON, err := json.Marshal(cv.Data)
	if err != nil {
		return nil, err
	}
	now := time.Now().UTC()
	_, err = db.conn.Exec(
		`INSERT INTO cv_versions (id, cv_id, data, message, created_at) VALUES (?, ?, ?, ?, ?)`,
		id, cvID, string(dataJSON), message, now,
	)
	if err != nil {
		return nil, err
	}
	return &models.CVVersion{
		ID:        id,
		CVID:      cvID,
		Data:      cv.Data,
		Message:   message,
		CreatedAt: now,
	}, nil
}

// CreateVersionFromData creates a version from explicit data (used for import).
func (db *DB) CreateVersionFromData(cvID, message string, data models.CVData) (*models.CVVersion, error) {
	id := uuid.New().String()
	dataJSON, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	now := time.Now().UTC()
	_, err = db.conn.Exec(
		`INSERT INTO cv_versions (id, cv_id, data, message, created_at) VALUES (?, ?, ?, ?, ?)`,
		id, cvID, string(dataJSON), message, now,
	)
	if err != nil {
		return nil, err
	}
	return &models.CVVersion{
		ID:        id,
		CVID:      cvID,
		Data:      data,
		Message:   message,
		CreatedAt: now,
	}, nil
}

// RestoreVersion restores a CV to a previous version's data.
func (db *DB) RestoreVersion(cvID, versionID string) (*models.CV, error) {
	version, err := db.GetVersion(cvID, versionID)
	if err != nil {
		return nil, err
	}
	if version == nil {
		return nil, nil
	}

	cv, err := db.GetCV(cvID)
	if err != nil {
		return nil, err
	}
	if cv == nil {
		return nil, nil
	}

	return db.UpdateCV(cvID, cv.Title, version.Data)
}

// --- Scan helpers ---

type scanner interface {
	Scan(dest ...any) error
}

func scanCV(s interface{ Scan(...any) error }) (models.CV, error) {
	var cv models.CV
	var dataStr string
	var createdAt, updatedAt string
	err := s.Scan(&cv.ID, &cv.Title, &dataStr, &createdAt, &updatedAt)
	if err != nil {
		return cv, err
	}
	if err := json.Unmarshal([]byte(dataStr), &cv.Data); err != nil {
		return cv, fmt.Errorf("unmarshal cv data: %w", err)
	}
	cv.CreatedAt, _ = time.Parse("2006-01-02 15:04:05+00:00", createdAt)
	if cv.CreatedAt.IsZero() {
		cv.CreatedAt, _ = time.Parse("2006-01-02T15:04:05Z", createdAt)
	}
	cv.UpdatedAt, _ = time.Parse("2006-01-02 15:04:05+00:00", updatedAt)
	if cv.UpdatedAt.IsZero() {
		cv.UpdatedAt, _ = time.Parse("2006-01-02T15:04:05Z", updatedAt)
	}
	return cv, nil
}

func scanCVRow(row *sql.Row) (models.CV, error) {
	var cv models.CV
	var dataStr string
	var createdAt, updatedAt string
	err := row.Scan(&cv.ID, &cv.Title, &dataStr, &createdAt, &updatedAt)
	if err != nil {
		return cv, err
	}
	if err := json.Unmarshal([]byte(dataStr), &cv.Data); err != nil {
		return cv, fmt.Errorf("unmarshal cv data: %w", err)
	}
	cv.CreatedAt, _ = time.Parse("2006-01-02 15:04:05+00:00", createdAt)
	if cv.CreatedAt.IsZero() {
		cv.CreatedAt, _ = time.Parse("2006-01-02T15:04:05Z", createdAt)
	}
	cv.UpdatedAt, _ = time.Parse("2006-01-02 15:04:05+00:00", updatedAt)
	if cv.UpdatedAt.IsZero() {
		cv.UpdatedAt, _ = time.Parse("2006-01-02T15:04:05Z", updatedAt)
	}
	return cv, nil
}

func scanVersion(s interface{ Scan(...any) error }) (models.CVVersion, error) {
	var v models.CVVersion
	var dataStr string
	var createdAt string
	err := s.Scan(&v.ID, &v.CVID, &dataStr, &v.Message, &createdAt)
	if err != nil {
		return v, err
	}
	if err := json.Unmarshal([]byte(dataStr), &v.Data); err != nil {
		return v, fmt.Errorf("unmarshal version data: %w", err)
	}
	v.CreatedAt, _ = time.Parse("2006-01-02 15:04:05+00:00", createdAt)
	if v.CreatedAt.IsZero() {
		v.CreatedAt, _ = time.Parse("2006-01-02T15:04:05Z", createdAt)
	}
	return v, nil
}

func scanVersionRow(row *sql.Row) (models.CVVersion, error) {
	var v models.CVVersion
	var dataStr string
	var createdAt string
	err := row.Scan(&v.ID, &v.CVID, &dataStr, &v.Message, &createdAt)
	if err != nil {
		return v, err
	}
	if err := json.Unmarshal([]byte(dataStr), &v.Data); err != nil {
		return v, fmt.Errorf("unmarshal version data: %w", err)
	}
	v.CreatedAt, _ = time.Parse("2006-01-02 15:04:05+00:00", createdAt)
	if v.CreatedAt.IsZero() {
		v.CreatedAt, _ = time.Parse("2006-01-02T15:04:05Z", createdAt)
	}
	return v, nil
}
