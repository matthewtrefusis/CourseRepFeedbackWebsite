CREATE TABLE poll_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  poll_id TEXT NOT NULL,
  answer TEXT NOT NULL CHECK (answer IN ('Manageable', 'About right', 'Too much')),
  voter_token_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE (poll_id, voter_token_hash)
);

CREATE INDEX poll_votes_poll_id_idx ON poll_votes (poll_id);
