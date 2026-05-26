CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  reference_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  is_ofw INTEGER,
  income_range TEXT,
  priorities TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  is_qualified INTEGER NOT NULL DEFAULT 0,
  source_page TEXT,
  requested_resource TEXT,
  recommended_follow_up TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'qualified', 'archived')),
  notes TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads (email);
CREATE INDEX IF NOT EXISTS leads_source_page_idx ON leads (source_page);

CREATE TABLE IF NOT EXISTS ebook_requests (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  source_page TEXT NOT NULL DEFAULT '/resources',
  requested_resource TEXT NOT NULL DEFAULT 'The Secret to Saving and Building Your Future',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'manual', 'delivered')),
  delivery_method TEXT NOT NULL DEFAULT 'email',
  sent_at TEXT,
  notes TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ebook_requests_created_at_idx ON ebook_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS ebook_requests_email_idx ON ebook_requests (email);

CREATE TABLE IF NOT EXISTS full_access_registrations (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  reference_id TEXT NOT NULL UNIQUE,
  source_page TEXT NOT NULL DEFAULT '/membership',
  first_name TEXT NOT NULL,
  middle_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  gender_other TEXT,
  civil_status TEXT NOT NULL,
  civil_status_other TEXT,
  date_of_birth TEXT NOT NULL,
  place_of_birth TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 0),
  weight TEXT NOT NULL,
  height TEXT NOT NULL,
  citizenship TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  consent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'approved', 'archived')),
  notes TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS full_access_registrations_created_at_idx ON full_access_registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS full_access_registrations_email_idx ON full_access_registrations (email);

CREATE TABLE IF NOT EXISTS ipon_challenge_registrations (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  reference_id TEXT NOT NULL UNIQUE,
  source_page TEXT NOT NULL DEFAULT '/membership',
  first_name TEXT NOT NULL,
  middle_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  gender_other TEXT,
  civil_status TEXT NOT NULL,
  civil_status_other TEXT,
  date_of_birth TEXT NOT NULL,
  place_of_birth TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 0),
  weight TEXT NOT NULL,
  height TEXT NOT NULL,
  citizenship TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  consent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'approved', 'archived')),
  notes TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ipon_challenge_registrations_created_at_idx ON ipon_challenge_registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS ipon_challenge_registrations_email_idx ON ipon_challenge_registrations (email);
