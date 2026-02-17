-- Database Schema Snapshot
-- This file is for reference only. 
-- Actual migrations are handled in internal/db/db.go

CREATE TABLE IF NOT EXISTS cvs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cv_versions (
    id TEXT PRIMARY KEY,
    cv_id TEXT NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
    data TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL, -- 'Applied', 'Interviewing', 'Rejected', 'Offer'
    salary TEXT,
    url TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    cv_id TEXT REFERENCES cvs(id) ON DELETE SET NULL,
    cv_version_id TEXT REFERENCES cv_versions(id) ON DELETE SET NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
