CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  stripe_customer_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS balances (
  user_id TEXT PRIMARY KEY,
  monthly_points_remaining INTEGER NOT NULL DEFAULT 0,
  purchased_points_remaining INTEGER NOT NULL DEFAULT 0,
  monthly_cycle_anchor TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS ledger (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  points_delta INTEGER NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);
