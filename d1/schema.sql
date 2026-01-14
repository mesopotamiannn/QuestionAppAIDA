DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  text TEXT NOT NULL,
  depth TEXT NOT NULL DEFAULT 'normal', -- light, normal, deep
  rating TEXT NOT NULL DEFAULT 'general', -- general, adult
  status TEXT NOT NULL DEFAULT 'approved', -- approved, pending, rejected
  created_at INTEGER,
  updated_at INTEGER
);

CREATE INDEX idx_questions_category ON questions(category_id);
-- Seed data will be inserted via separate migration or SQL execution
