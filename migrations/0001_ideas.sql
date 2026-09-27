CREATE TABLE IF NOT EXISTS idea_submissions (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  email_hash TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'vi')),
  fields_json TEXT NOT NULL,
  consent_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'archived'))
);

CREATE INDEX IF NOT EXISTS idea_submissions_created_at ON idea_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idea_submissions_email_hash ON idea_submissions(email_hash, created_at DESC);
