-- users already has stripe_customer_id in this environment; only add what is missing.

ALTER TABLE users ADD COLUMN clerk_user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);
