-- ============================================================
-- Task System Database Schema
-- Tables: task_definitions, player_tasks, player_clog_items
-- ============================================================

-- 1. Task Definitions — the 960 tasks imported from task-list.json
CREATE TABLE IF NOT EXISTS task_definitions (
  id UUID PRIMARY KEY,
  tier TEXT NOT NULL CHECK (tier IN ('easy', 'medium', 'hard', 'elite', 'master')),
  name TEXT NOT NULL,
  tip TEXT,
  wiki_link TEXT,
  image_link TEXT,
  display_item_id INTEGER,
  verification_method TEXT, -- 'collection-log', 'achievement-diary', 'skill', or NULL
  item_ids INTEGER[] DEFAULT '{}',
  required_count INTEGER DEFAULT 1,
  diary_region TEXT,
  diary_difficulty TEXT,
  skill_experience JSONB, -- for skill-type verification: {"attack": 13034431, ...}
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_definitions_tier ON task_definitions(tier);

-- 2. Player Tasks — tracks active/completed/skipped tasks per player
CREATE TABLE IF NOT EXISTS player_tasks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  player_name TEXT NOT NULL,
  task_id UUID NOT NULL REFERENCES task_definitions(id),
  tier TEXT NOT NULL CHECK (tier IN ('easy', 'medium', 'hard', 'elite', 'master')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'skipped')),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(player_name, task_id, status) -- prevent duplicate active tasks
);

CREATE INDEX IF NOT EXISTS idx_player_tasks_player ON player_tasks(player_name);
CREATE INDEX IF NOT EXISTS idx_player_tasks_active ON player_tasks(player_name, status) WHERE status = 'active';

-- 3. Player Collection Log Items — every obtained item ID per player
CREATE TABLE IF NOT EXISTS player_clog_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  player_name TEXT NOT NULL,
  item_id INTEGER NOT NULL,
  item_name TEXT,
  quantity INTEGER DEFAULT 1,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_name, item_id)
);

CREATE INDEX IF NOT EXISTS idx_player_clog_items_player ON player_clog_items(player_name);
CREATE INDEX IF NOT EXISTS idx_player_clog_items_lookup ON player_clog_items(player_name, item_id);

-- 4. Player Settings — per-player task system preferences
CREATE TABLE IF NOT EXISTS player_task_settings (
  player_name TEXT PRIMARY KEY,
  auto_generate BOOLEAN DEFAULT FALSE,
  active_tier TEXT DEFAULT 'easy' CHECK (active_tier IN ('easy', 'medium', 'hard', 'elite', 'master')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE task_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_clog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_task_settings ENABLE ROW LEVEL SECURITY;

-- Public read for task definitions
CREATE POLICY "task_definitions_public_read" ON task_definitions
  FOR SELECT USING (true);

-- Service role full access for all tables
CREATE POLICY "player_tasks_service" ON player_tasks
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "player_clog_items_service" ON player_clog_items
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "player_task_settings_service" ON player_task_settings
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "task_definitions_service" ON task_definitions
  FOR ALL USING (true) WITH CHECK (true);
