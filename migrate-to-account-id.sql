-- ============================================================
-- Migration: Add account_id to task system tables + name history
-- ============================================================

-- 1. Add previous_names to accounts for name history tracking
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS previous_names TEXT[] DEFAULT '{}';

-- 2. Add account_id to player_tasks
ALTER TABLE player_tasks ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id);

-- 3. Add account_id to player_clog_items
ALTER TABLE player_clog_items ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id);

-- 4. Add account_id to player_task_settings
ALTER TABLE player_task_settings ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id);

-- 5. Populate account_id from existing player_name data
UPDATE player_tasks pt
SET account_id = a.id
FROM accounts a
WHERE LOWER(pt.player_name) = LOWER(a.username)
AND pt.account_id IS NULL;

UPDATE player_clog_items pci
SET account_id = a.id
FROM accounts a
WHERE LOWER(pci.player_name) = LOWER(a.username)
AND pci.account_id IS NULL;

UPDATE player_task_settings pts
SET account_id = a.id
FROM accounts a
WHERE LOWER(pts.player_name) = LOWER(a.username)
AND pts.account_id IS NULL;

-- 6. Create indexes on account_id
CREATE INDEX IF NOT EXISTS idx_player_tasks_account_id ON player_tasks(account_id);
CREATE INDEX IF NOT EXISTS idx_player_clog_items_account_id ON player_clog_items(account_id);
CREATE INDEX IF NOT EXISTS idx_player_task_settings_account_id ON player_task_settings(account_id);

-- 7. Add unique constraint for account_id on settings
-- (drop old primary key first if needed, then re-add)
ALTER TABLE player_task_settings DROP CONSTRAINT IF EXISTS player_task_settings_pkey;
ALTER TABLE player_task_settings ADD CONSTRAINT player_task_settings_pkey PRIMARY KEY (player_name);
