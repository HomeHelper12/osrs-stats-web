-- OSRS Stats Web - Supabase Database Schema
-- Run this in the Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/ivelrglvvkfohlvzagum/sql/new

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Accounts table: stores unique player accounts
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  account_type TEXT,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on lowercase username for case-insensitive lookups
CREATE INDEX IF NOT EXISTS idx_accounts_username_lower ON accounts (LOWER(username));

-- Snapshots table: stores full JSON snapshots of account data
CREATE TABLE IF NOT EXISTS snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup of latest snapshot per account
CREATE INDEX IF NOT EXISTS idx_snapshots_account_uploaded ON snapshots (account_id, uploaded_at DESC);

-- Enable Row Level Security (but allow service role full access)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;

-- Policy: allow anonymous reads on accounts
CREATE POLICY "Allow anonymous read access on accounts"
  ON accounts FOR SELECT
  TO anon
  USING (true);

-- Policy: allow anonymous reads on snapshots
CREATE POLICY "Allow anonymous read access on snapshots"
  ON snapshots FOR SELECT
  TO anon
  USING (true);

-- Policy: allow service role full access on accounts
CREATE POLICY "Allow service role full access on accounts"
  ON accounts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: allow service role full access on snapshots
CREATE POLICY "Allow service role full access on snapshots"
  ON snapshots FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
